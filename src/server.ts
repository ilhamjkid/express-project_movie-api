import app from "#app";
import { prisma } from "#config/db.config";
import { env } from "#config/env.config";
import { handleGracefulShutdown } from "#utils/shutdown.util";

async function bootstrap() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("[DATABASE] Connected successfully.");
  } catch (err) {
    console.error("[DATABASE] Initial connection failed:", err);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`[SERVER] Running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode.`);
  });

  const shutdown = handleGracefulShutdown(server);

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("uncaughtException", (error) => shutdown("uncaughtException", error));
  process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    shutdown("unhandledRejection", error);
  });
}

bootstrap();
