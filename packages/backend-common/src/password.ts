import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "./config.js";

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plaintext, hash);
  } catch {
    return false;
  }
}

export function looksLikePlaintextPassword(stored: string): boolean {
  return !/^\$2[aby]\$\d{2}\$/.test(stored);
}
