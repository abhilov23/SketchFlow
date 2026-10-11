import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./config.js";

export interface AccessTokenClaims {
  userId: string;
}

export function signAccessToken(userId: string): string {
  const options = { expiresIn: JWT_EXPIRES_IN } as SignOptions;
  return jwt.sign({ userId } satisfies AccessTokenClaims, JWT_SECRET, options);
}

export function verifyAccessToken(token: string | undefined | null): AccessTokenClaims | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") return null;

    const { userId } = decoded as JwtPayload;
    if (typeof userId !== "string" || userId.length === 0) return null;

    return { userId };
  } catch {
    return null;
  }
}

export function extractBearerToken(headerValue: string | undefined): string | null {
  if (!headerValue) return null;

  const [scheme, ...rest] = headerValue.trim().split(/\s+/);
  if (!scheme || scheme.toLowerCase() !== "bearer") return null;

  const token = rest.join(" ").trim();
  return token.length > 0 ? token : null;
}
