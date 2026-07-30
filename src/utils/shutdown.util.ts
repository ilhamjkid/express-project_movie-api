import { Server } from "http";
import { prisma } from "#config/db.config";

export function handleGracefulShutdown(server: Server) {
  let isShuttingDown = false;

  return async function (signal: string, error?: Error) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n[SYSTEM] Received ${signal}. Starting graceful shutdown...`);

    if (error) console.error("[SYSTEM] Uncaught Error details:", error);

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      console.log("[HTTP] Server closed.");

      await prisma.$disconnect();
      console.log("[DATABASE] Disconnected successfully.");

      process.exit(error ? 1 : 0);
    } catch (err) {
      console.error("[SYSTEM] Error during shutdown:", err);
      process.exit(1);
    }
  };
}
