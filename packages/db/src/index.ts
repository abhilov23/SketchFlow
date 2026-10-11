import { loadEnv } from "@repo/backend-common/config";
import { PrismaClient } from "@prisma/client";

loadEnv();

export { Prisma } from "@prisma/client";
export type { User, Room, RoomMember, Chat } from "@prisma/client";

export const prismaClient = new PrismaClient();
