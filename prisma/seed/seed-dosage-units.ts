import { PrismaClient } from "@prisma/client";

const dosageUnits = [
  { name: "mg" },
  { name: "g" },
  { name: "ml" },
  { name: "IU" },
  { name: "mcg" },
  { name: "drop" },
];

export async function seedDosageUnits(prisma: PrismaClient) {
  console.log("🌱 Checking dosage units...");
  const count = await prisma.dosageUnit.count();
  if (count > 0) {
    console.log(`ℹ️ Found ${count} existing dosage units — skipping seeding.`);
    return;
  }

  await prisma.dosageUnit.createMany({ data: dosageUnits });
  console.log(`✅ Seeded ${dosageUnits.length} dosage units.`);
}
