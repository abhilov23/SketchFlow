import { type NextFunction, type Request, type Response } from "express";
import { Prisma } from "@repo/db/client";
import { verifyAccessToken, extractBearerToken } from "@repo/backend-common/token";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.headers.authorization);

  const claims = token ? verifyAccessToken(token) : null;
  if (!claims) {
    res.status(401).json({ message: "Sign in to continue." });
    return;
  }

  req.userId = claims.userId;
  next();
}

export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new Error("getUserId called on an unauthenticated request");
  }
  return req.userId;
}

export function asyncHandler<T extends Request = Request>(
  handler: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req as T, res, next).catch(next);
  };
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (res.headersSent) return;

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({ message: "That name is already taken." });
    return;
  }

  console.error("[http-backend] unhandled error:", err);
  res.status(500).json({ message: "Something went wrong on our end." });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: "Not found." });
}
