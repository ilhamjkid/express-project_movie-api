import "dotenv/config";
import * as z from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .string("NODE_ENV is required.")
    .refine((val) => val !== "", {
      error: "NODE_ENV is required.",
      abort: true,
    })
    .pipe(
      z.enum(
        ["development", "production", "test"],
        "NODE_ENV can only be development|production|test.",
      ),
    ),

  PORT: z.coerce
    .number("PORT number is required.")
    .refine((val) => val !== 0, {
      error: "PORT number is required.",
      abort: true,
    })
    .min(1024, "PORT number must be above 1024.")
    .max(49151, "PORT number must be below 49151."),

  DATABASE_URL: z
    .string("DATABASE_URL is required.")
    .refine((val) => val !== "", {
      error: "DATABASE_URL is required",
      abort: true,
    })
    .pipe(z.url("Invalid DATABASE_URL.")),
});

const parseResult = EnvSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("Invalid env configuration.");
  console.error(z.flattenError(parseResult.error));
  process.exit(1);
}

export const env = Object.freeze(parseResult.data);
