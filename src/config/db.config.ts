import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.ts";
import { env } from "./env.config.ts";

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
