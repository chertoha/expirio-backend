import { PrismaClient } from "@prisma/client";

const drugForms = [
  { name: "Tablet" },
  { name: "Capsule" },
  { name: "Pill" },
  { name: "Syrup" },
  { name: "Suspension" },
  { name: "Solution" },
  { name: "Injection" },
  { name: "Ampoule" },
  { name: "Vial" },
  { name: "Ointment" },
  { name: "Cream" },
  { name: "Gel" },
  { name: "Lotion" },
  { name: "Drops (Eye)" },
  { name: "Drops (Ear)" },
  { name: "Nasal Spray" },
  { name: "Inhaler" },
  { name: "Powder" },
  { name: "Granules" },
  { name: "Suppository" },
  { name: "Patch (Transdermal)" },
  { name: "Lozenge" },
  { name: "Mouthwash" },
  { name: "Implant" },
  { name: "Chewable Tablet" },
  { name: "Effervescent Tablet" },
  { name: "Sachet" },
  { name: "Topical Spray" },
  { name: "Oral Spray" },
  { name: "Eye Ointment" },
];

export async function seedDrugForms(prisma: PrismaClient) {
  console.log("🌱 Checking drug forms...");
  const count = await prisma.drugForm.count();
  if (count > 0) {
    console.log(`ℹ️ Found ${count} existing drug forms — skipping seeding.`);
    return;
  }

  await prisma.drugForm.createMany({ data: drugForms });
  console.log(`✅ Seeded ${drugForms.length} drug forms.`);
}
