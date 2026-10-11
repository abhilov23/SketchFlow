function readUrl(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  if (!value) return fallback;

  try {
    new URL(value);
  } catch {
    throw new Error(`${name} is not a valid URL: "${value}"`);
  }

  return value.replace(/\/+$/, "");
}

export const HTTP_BACKEND: string = readUrl("NEXT_PUBLIC_HTTP_BACKEND", "http://localhost:3005");

export const WS_URL: string = readUrl("NEXT_PUBLIC_WS_URL", "ws://localhost:8089");

export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
