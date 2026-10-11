import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(3, "Enter your email address.")
  .max(254, "That email address is too long.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be 72 characters or less.");

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Tell us what to call you.")
  .max(60, "Name must be 60 characters or less.");

export const roomSlugSchema = z
  .string()
  .trim()
  .min(3, "Board name must be at least 3 characters.")
  .max(40, "Board name must be 40 characters or less.")
  .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/, "Use letters, numbers and dashes only.");

export const CreateUserSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: displayNameSchema,
  })
  .strict();

export const SigninSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required."),
  })
  .strict();

export const CreateRoomSchema = z
  .object({
    name: roomSlugSchema,
  })
  .strict();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type SigninInput = z.infer<typeof SigninSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;

export const DrawingEventSchema = z
  .object({
    shape: z.object({ type: z.string(), id: z.string().optional() }).passthrough(),
    eraseId: z.string().optional(),
  })
  .passthrough();

export type DrawingEvent = z.infer<typeof DrawingEventSchema>;

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.join(".") : "form";
    if (!fieldErrors[field]) fieldErrors[field] = issue.message;
  }

  return fieldErrors;
}
