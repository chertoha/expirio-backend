// import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "../../generated/prisma/client";
// import { PrismaClient } from "generated/prisma";
import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./seed-categories";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting global seed...");

  await seedCategories(prisma);

  console.log("🌍 Seeding completed!");
}

main()
  .catch(e => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
