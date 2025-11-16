import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./seed-categories";
import { seedDrugForms } from "./seed-drug-forms";
import { seedActiveIngredients } from "./seed-active-ingredients";
import { seedDosageUnits } from "./seed-dosage-units";
import { seedProducts } from "./seed-products";
import { seedStorages } from "./seed-storages";
import { seedBatches } from "./seed-batches";
import { seedStorageBatches } from "./seed-storage-batches";
import { clearDatabase } from "./clear-database";
import { seedAlerts } from "./seed-alerts";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting global seed...");
  await clearDatabase(prisma);

  await seedCategories(prisma);
  await seedDrugForms(prisma);
  await seedActiveIngredients(prisma);
  await seedDosageUnits(prisma);
  await seedProducts(prisma);
  await seedStorages(prisma);
  await seedBatches(prisma);
  await seedStorageBatches(prisma);
  await seedAlerts(prisma);

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
