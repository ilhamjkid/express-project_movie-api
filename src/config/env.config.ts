import "dotenv/config";
import * as z from "zod";
import type { StringValue } from "ms";

const MS_DURATION_REGEX = /^\d+(?:\.\d+)?\s*(?:ms|s|m|h|d|w|y)?$/i;

const envSchema = z.object({
  NODE_ENV: z
    .string("NODE_ENV is required.")
    .min(1, "NODE_ENV cannot be empty.")
    .pipe(
      z.enum(
        ["development", "production", "test"],
        "NODE_ENV must be 'development', 'production', or 'test'.",
      ),
    ),

  PORT: z.coerce
    .number("PORT is required.")
    .gt(1, { error: "PORT cannot be empty.", abort: true })
    .gte(1024, "PORT must be at least 1024.")
    .lte(49151, "PORT must be at most 49151."),

  DATABASE_URL: z
    .string("DATABASE_URL is required.")
    .min(1, "DATABASE_URL cannot be empty.")
    .pipe(z.url("DATABASE_URL must be a valid connection URL.")),

  ACCESS_TOKEN_SECRET: z
    .string("ACCESS_TOKEN_SECRET is required.")
    .min(1, "ACCESS_TOKEN_SECRET cannot be empty."),

  ACCESS_TOKEN_EXPIRES_IN: z
    .string("ACCESS_TOKEN_EXPIRES_IN is required.")
    .min(1, "ACCESS_TOKEN_EXPIRES_IN cannot be empty.")
    .regex(
      MS_DURATION_REGEX,
      "ACCESS_TOKEN_EXPIRES_IN must be a valid duration string like '5m' or '7d'",
    )
    .transform((val) => val as StringValue),

  REFRESH_TOKEN_SECRET: z
    .string("REFRESH_TOKEN_SECRET is required.")
    .min(1, "REFRESH_TOKEN_SECRET cannot be empty."),

  REFRESH_TOKEN_EXPIRES_IN: z
    .string("REFRESH_TOKEN_EXPIRES_IN is required.")
    .min(1, "REFRESH_TOKEN_EXPIRES_IN cannot be empty.")
    .regex(
      MS_DURATION_REGEX,
      "REFRESH_TOKEN_EXPIRES_IN must be a valid duration string like '5m' or '7d'",
    )
    .transform((val) => val as StringValue),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("\n[ENV] Invalid Environment Variables Configuration:");

  const formattedErrors = parseResult.error.issues;
  formattedErrors.forEach((issue) => {
    const field = issue.path.join(".");
    console.error(`  • ${field}: ${issue.message}`);
  });

  console.error("[ENV] Please check your .env file and restart the server.\n");
  process.exit(1);
}

export const env = Object.freeze(parseResult.data);
