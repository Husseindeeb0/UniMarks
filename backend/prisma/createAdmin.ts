import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

  const admin = await prisma.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL!,
    },
    update: {},
    create: {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });