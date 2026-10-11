import { loadEnv } from "./env.js";

loadEnv();

export { loadEnv };

const MIN_SECRET_LENGTH = 32;

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(
      `[config] ${name} is not set. Copy .env.example to .env and fill it in ` +
        `(see the README "Environment" section). Refusing to start with a missing ${name}.`,
    );
  }

  return value;
}

function requireStrongSecret(name: string): string {
  const value = requireEnv(name);

  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `[config] ${name} must be at least ${MIN_SECRET_LENGTH} characters (got ${value.length}). ` +
        `Generate a strong one with: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`,
    );
  }

  return value;
}

function readPort(name: string, fallback: number): number {
  const raw = process.env[name];

  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`[config] ${name} must be a valid TCP port between 1 and 65535, got "${raw}".`);
  }

  return parsed;
}

function readPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`[config] ${name} must be a positive integer, got "${raw}".`);
  }

  return parsed;
}

export const JWT_SECRET: string = requireStrongSecret("JWT_SECRET");

export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN?.trim() || "7d";

export const BCRYPT_ROUNDS: number = readPositiveInt("BCRYPT_ROUNDS", 12);

export const HTTP_BACKEND_PORT: number = readPort("HTTP_BACKEND_PORT", 3005);
export const WS_BACKEND_PORT: number = readPort("WS_BACKEND_PORT", 8089);

export const PUBLIC_API_ORIGIN: string | undefined = process.env.PUBLIC_API_ORIGIN?.trim() || undefined;

export const NODE_ENV: string = process.env.NODE_ENV ?? "development";

export const isProduction: boolean = NODE_ENV === "production";
