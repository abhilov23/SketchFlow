import express, { type Request, type Response } from "express";
import cors from "cors";
import { prismaClient } from "@repo/db/client";
import { CreateUserSchema, SigninSchema, CreateRoomSchema, toFieldErrors } from "@repo/common/types";
import { hashPassword, verifyPassword, looksLikePlaintextPassword } from "@repo/backend-common/password";
import { signAccessToken } from "@repo/backend-common/token";
import { HTTP_BACKEND_PORT, PUBLIC_API_ORIGIN, isProduction } from "@repo/backend-common/config";
import { asyncHandler, errorHandler, getUserId, notFoundHandler, requireAuth } from "./middleware";
import { rateLimit } from "./rateLimit";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

const allowedOrigins = new Set<string>();
if (PUBLIC_API_ORIGIN) {
  allowedOrigins.add(PUBLIC_API_ORIGIN);
} else {
  for (const port of [3000, 3001, 3005]) {
    allowedOrigins.add(`http://localhost:${port}`);
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  }),
);

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many attempts. Try again in a few minutes.",
});

app.post(
  "/signup",
  authRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = CreateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Check the highlighted fields and try again.",
        errors: toFieldErrors(parsed.error),
      });
      return;
    }

    const { email, password, name } = parsed.data;

    const existing = await prismaClient.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      res.status(409).json({ message: "An account with that email already exists." });
      return;
    }

    const user = await prismaClient.user.create({
      data: { email, password: await hashPassword(password), name },
      select: { id: true },
    });

    res.status(201).json({ userId: user.id });
  }),
);

app.post(
  "/signin",
  authRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = SigninSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Check the highlighted fields and try again.",
        errors: toFieldErrors(parsed.error),
      });
      return;
    }

    const { email, password } = parsed.data;

    const user = await prismaClient.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    const storedHash = user?.password ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
    const valid = await verifyPassword(password, storedHash);

    if (!user || !valid) {
      if (user && looksLikePlaintextPassword(user.password) && user.password === password) {
        await prismaClient.user.update({
          where: { id: user.id },
          data: { password: await hashPassword(password) },
        });
      } else {
        res.status(401).json({ message: "That email and password don't match." });
        return;
      }
    }

    res.status(200).json({ token: signAccessToken(user.id) });
  }),
);

app.post(
  "/room",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = CreateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Check the highlighted fields and try again.",
        errors: toFieldErrors(parsed.error),
      });
      return;
    }

    const userId = getUserId(req);
    const slug = parsed.data.name;

    const room = await prismaClient.room.create({
      data: {
        slug,
        adminId: userId,
        members: { create: { userId } },
      },
      select: { id: true },
    });

    res.status(201).json({ roomId: room.id });
  }),
);

app.get(
  "/rooms",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const memberships = await prismaClient.roomMember.findMany({
      where: { userId },
      orderBy: { joinedAt: "desc" },
      select: {
        room: {
          select: {
            id: true,
            slug: true,
            createdAt: true,
            adminId: true,
            _count: { select: { members: true } },
          },
        },
      },
    });

    const rooms = memberships.map(({ room }) => ({
      id: room.id,
      slug: room.slug,
      createdAt: room.createdAt,
      isOwner: room.adminId === userId,
      memberCount: room._count.members,
    }));

    res.status(200).json({ room: rooms });
  }),
);

app.get(
  "/room/:slug",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
      where: { slug, members: { some: { userId } } },
      select: { id: true, slug: true, adminId: true, _count: { select: { members: true } } },
    });

    if (!room) {
      res.status(404).json({ message: "We couldn't find that board." });
      return;
    }

    res.status(200).json({
      room: {
        id: room.id,
        slug: room.slug,
        isOwner: room.adminId === userId,
        memberCount: room._count.members,
      },
    });
  }),
);

app.post(
  "/room/:slug/join",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const slug = req.params.slug;

    const room = await prismaClient.room.findUnique({
      where: { slug },
      select: { id: true, slug: true, adminId: true },
    });

    if (!room) {
      res.status(404).json({ message: "We couldn't find that board." });
      return;
    }

    await prismaClient.roomMember.upsert({
      where: { roomId_userId: { roomId: room.id, userId } },
      create: { roomId: room.id, userId },
      update: {},
    });

    res.status(200).json({
      room: { id: room.id, slug: room.slug, isOwner: room.adminId === userId },
    });
  }),
);

app.delete(
  "/room/:slug",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const slug = req.params.slug;

    const room = await prismaClient.room.findUnique({
      where: { slug },
      select: { id: true, adminId: true },
    });

    if (!room) {
      res.status(404).json({ message: "We couldn't find that board." });
      return;
    }
    if (room.adminId !== userId) {
      res.status(403).json({ message: "Only the board owner can delete it." });
      return;
    }

    await prismaClient.room.delete({ where: { id: room.id } });

    res.status(200).json({ message: "Board deleted." });
  }),
);

app.get(
  "/chats/:roomId",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const roomId = Number(req.params.roomId);
    if (!Number.isInteger(roomId) || roomId <= 0) {
      res.status(400).json({ message: "That board id isn't valid." });
      return;
    }

    const membership = await prismaClient.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
      select: { roomId: true },
    });
    if (!membership) {
      res.status(404).json({ message: "We couldn't find that board." });
      return;
    }

    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "asc" },
      select: { id: true, message: true, userId: true },
    });

    res.status(200).json({ messages });
  }),
);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(HTTP_BACKEND_PORT, () => {
  const corsNote = PUBLIC_API_ORIGIN
    ? `cors=${PUBLIC_API_ORIGIN}`
    : `cors=localhost:${isProduction ? "NOT CONFIGURED — set PUBLIC_API_ORIGIN" : "3000"}`;
  console.log(`[http-backend] listening on :${HTTP_BACKEND_PORT} (${corsNote})`);
});

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`[http-backend] ${signal} received, shutting down`);

  server.close(async () => {
    await prismaClient.$disconnect();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
