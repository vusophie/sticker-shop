import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/sticker_shop";

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = new PrismaClient({ adapter });
