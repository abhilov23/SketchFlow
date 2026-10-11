import { WebSocketServer, WebSocket, type RawData } from "ws";
import type { IncomingMessage } from "node:http";
import { prismaClient } from "@repo/db/client";
import { DrawingEventSchema } from "@repo/common/types";
import { verifyAccessToken } from "@repo/backend-common/token";
import { WS_BACKEND_PORT, isProduction } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: WS_BACKEND_PORT });

const HEARTBEAT_INTERVAL_MS = 30_000;

interface ConnectedUser {
  ws: WebSocket;
  rooms: Set<string>;
  userId: string;
  isAlive: boolean;
}

const users = new Map<WebSocket, ConnectedUser>();

async function isRoomMember(userId: string, roomId: number): Promise<boolean> {
  const membership = await prismaClient.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
    select: { roomId: true },
  });
  return membership !== null;
}

function parseRoomId(value: unknown): number | null {
  const roomId = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(roomId) || roomId <= 0) return null;
  return roomId;
}

wss.on("connection", function connection(ws: WebSocket, request: IncomingMessage) {
  const url = request.url;
  if (!url) {
    ws.close(1008, "Missing connection details");
    return;
  }

  const query = new URLSearchParams(url.split("?")[1] ?? "");
  const claims = verifyAccessToken(query.get("token"));
  if (!claims) {
    ws.close(1008, "Invalid or expired token");
    return;
  }

  const userId = claims.userId;
  const record: ConnectedUser = { ws, rooms: new Set(), userId, isAlive: true };
  users.set(ws, record);

  ws.on("pong", () => {
    record.isAlive = true;
  });

  ws.on("message", function message(raw) {
    void handleMessage(ws, userId, raw);
  });

  ws.on("close", () => {
    users.delete(ws);
  });

  ws.on("error", (err) => {
    console.error("[ws-backend] socket error:", err.message);
    users.delete(ws);
  });
});

async function handleMessage(ws: WebSocket, userId: string, raw: RawData): Promise<void> {
  const user = users.get(ws);
  if (!user) return;

  let payload: unknown;
  try {
    payload = JSON.parse(typeof raw === "string" ? raw : raw.toString());
  } catch {
    return;
  }

  if (typeof payload !== "object" || payload === null) return;
  const { type } = payload as { type?: unknown };
  if (typeof type !== "string") return;

  const roomId = parseRoomId((payload as { roomId?: unknown }).roomId);
  if (roomId === null) return;

  if (!(await isRoomMember(userId, roomId))) return;

  switch (type) {
    case "join_room": {
      if (!user.rooms.has(String(roomId))) user.rooms.add(String(roomId));
      return;
    }

    case "leave_room": {
      user.rooms.delete(String(roomId));
      return;
    }

    case "chat": {
      const event = DrawingEventSchema.safeParse((payload as { message?: unknown }).message);
      if (!event.success) return;

      const message = (payload as { message: string }).message;

      try {
        await prismaClient.chat.create({ data: { roomId, message, userId } });
      } catch (err) {
        console.error("[ws-backend] failed to persist event:", err);
        return;
      }

      const outbound = JSON.stringify({ type: "chat", message, roomId });
      for (const [socket, peer] of users) {
        if (socket.readyState !== WebSocket.OPEN) continue;
        if (!peer.rooms.has(String(roomId))) continue;
        socket.send(outbound);
      }
      return;
    }

    default:
      return;
  }
}

const heartbeat = setInterval(() => {
  for (const [socket, user] of users) {
    if (!user.isAlive) {
      socket.terminate();
      users.delete(socket);
      continue;
    }
    user.isAlive = false;
    socket.ping();
  }
}, HEARTBEAT_INTERVAL_MS);
heartbeat.unref?.();

wss.on("listening", () => {
  console.log(`[ws-backend] listening on :${WS_BACKEND_PORT}${isProduction ? "" : " (dev)"}`);
});

wss.on("close", () => clearInterval(heartbeat));

async function shutdown(signal: string): Promise<void> {
  console.log(`[ws-backend] ${signal} received, shutting down`);

  for (const socket of users.keys()) socket.close(1001, "Server shutting down");

  wss.close(() => void prismaClient.$disconnect().then(() => process.exit(0)));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
