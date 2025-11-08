// seed-storages.ts
import { PrismaClient } from "@prisma/client";

const storages = [
  {
    name: "Main Display Shelf",
    description: "Main showcase for popular OTC medicines",
    temperature: 22,
  },
  {
    name: "Prescription Shelf",
    description: "Storage for prescription drugs",
    temperature: 22,
  },
  {
    name: "Cold Storage Fridge",
    description: "Refrigerated medicines and vaccines",
    temperature: 4,
  },
  {
    name: "Controlled Substances Safe",
    description: "Locked safe for narcotic drugs",
    temperature: 22,
  },
  {
    name: "Vitamin Shelf",
    description: "Display area for vitamins and supplements",
    temperature: 22,
  },
  {
    name: "Topical Storage",
    description: "Storage for creams, gels, ointments",
    temperature: 22,
  },
  {
    name: "Antibiotic Drawer",
    description: "Drawer for antibiotic medications",
    temperature: 22,
  },
  {
    name: "Painkiller Section",
    description: "Analgesic drugs and NSAIDs",
    temperature: 22,
  },
  {
    name: "Diabetic Drugs Shelf",
    description: "Storage for insulin and oral antidiabetic drugs",
    temperature: 22,
  },
  {
    name: "Eye & Ear Drops Cabinet",
    description: "Separate section for ophthalmic and otic solutions",
    temperature: 22,
  },
  {
    name: "Hormonal Drugs Box",
    description: "Hormonal drugs requiring secure storage",
    temperature: 22,
  },
  {
    name: "Cough & Cold Shelf",
    description: "Medicines for respiratory conditions",
    temperature: 22,
  },
  {
    name: "Warehouse Reserve",
    description: "Backup stock area",
    temperature: 20,
  },
  {
    name: "Liquid Medicine Rack",
    description: "Syrups, suspensions, and solutions",
    temperature: 22,
  },
  {
    name: "Infant Care Section",
    description: "Products for pediatric use",
    temperature: 22,
  },
];

export async function seedStorages(prisma: PrismaClient) {
  console.log("🌱 Checking storages...");

  const count = await prisma.storage.count();
  if (count > 0) {
    console.log(`ℹ️ Found ${count} existing storages — skipping seeding.`);
    return;
  }

  await prisma.storage.createMany({ data: storages });
  console.log(`✅ Seeded ${storages.length} storages.`);
}
