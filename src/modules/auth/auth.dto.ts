import * as z from "zod";

export const registerSchema = z.object({
  name: z
    .string("Name is required.")
    .min(1, "Name cannot be empty.")
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),

  email: z
    .string("Email is required.")
    .min(1, "Email cannot be empty.")
    .max(254, "Email must be at most 254 characters.")
    .pipe(z.email("Email format is invalid.")),

  password: z
    .string("Password is required.")
    .min(1, "Password cannot be empty.")
    .min(8, "Password must be at least 8 characters.")
    .max(32, "Password must be at most 32 characters.")
    // --- REGEX FOR STRONG PASSWORD ---
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least 1 number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character."),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string("Email is required.").min(1, "Email cannot be empty."),

  password: z.string("Password is required.").min(1, "Password cannot be empty."),
});
export type LoginInput = z.infer<typeof loginSchema>;
