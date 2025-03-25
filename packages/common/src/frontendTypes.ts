// lib/schemas.ts
import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(3, "Email must be at least 3 characters").max(30, "Email must be 20 characters or less"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
});

export const SigninSchema = z.object({
  username: z.string().min(3, "Email must be at least 3 characters").max(30, "Email must be 20 characters or less"),
  password: z.string().min(1, "Password is required"),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be 20 characters or less"),
});