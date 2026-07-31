import app from "#app";
import { prisma } from "#config/db.config";
import { env } from "#config/env.config";
import { createShutdownHandler } from "#utils/shutdown.util";

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

  const shutdownHandler = createShutdownHandler(server);

  process.on("SIGINT", () => shutdownHandler("SIGINT"));
  process.on("SIGTERM", () => shutdownHandler("SIGTERM"));
  process.on("uncaughtException", (error) => shutdownHandler("uncaughtException", error));
  process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    shutdownHandler("unhandledRejection", error);
  });
}

bootstrap();
