import "dotenv/config";
import * as z from "zod";

const EnvSchema = z.object({
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

  JWT_SECRET_KEY: z.string("JWT_SECRET_KEY is required.").min(1, "JWT_SECRET_KEY cannot be empty."),
});

const parseResult = EnvSchema.safeParse(process.env);

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
