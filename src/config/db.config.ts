import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "#prisma/client";
import { env } from "#config/env.config";

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
