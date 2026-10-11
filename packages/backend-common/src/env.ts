import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

function findEnvFile(start: string): string | null {
  let dir = path.resolve(start);

  for (;;) {
    const candidate = path.join(dir, ".env");
    if (fs.existsSync(candidate)) return candidate;

    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

let loaded = false;

export function loadEnv(): void {
  if (loaded) return;
  loaded = true;

  const candidates: string[] = [];

  const rootEnv = findEnvFile(process.cwd());
  if (rootEnv) candidates.push(rootEnv);

  const localEnv = path.join(process.cwd(), ".env");
  if (!candidates.includes(localEnv) && fs.existsSync(localEnv)) {
    candidates.push(localEnv);
  }

  for (const file of candidates) {
    dotenv.config({ path: file });
  }
}
