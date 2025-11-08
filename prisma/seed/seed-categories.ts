import { PrismaClient } from "@prisma/client";

const categories = [
  {
    name: "Antibiotics",
    description:
      "Used to treat bacterial infections (e.g., amoxicillin, azithromycin).",
  },
  {
    name: "Antivirals",
    description: "Treat viral infections (e.g., acyclovir, oseltamivir).",
  },
  {
    name: "Antifungals",
    description:
      "Used to treat fungal infections (e.g., fluconazole, terbinafine).",
  },
  {
    name: "Analgesics",
    description:
      "Pain relief medications (e.g., paracetamol, ibuprofen, tramadol).",
  },
  {
    name: "Anti-inflammatory Drugs",
    description: "Reduce inflammation (NSAIDs, corticosteroids).",
  },
  {
    name: "Antihistamines",
    description:
      "For allergies and histamine-related conditions (e.g., loratadine, cetirizine).",
  },
  {
    name: "Antidepressants",
    description: "Treat depression and anxiety (e.g., fluoxetine, sertraline).",
  },
  {
    name: "Cardiovascular Drugs",
    description:
      "Treat heart diseases and regulate blood pressure (e.g., atenolol, amlodipine).",
  },
  {
    name: "Antidiabetic Agents",
    description: "Control blood glucose levels (e.g., metformin, insulin).",
  },
  {
    name: "Gastrointestinal Drugs",
    description:
      "For stomach and intestinal disorders (e.g., omeprazole, ranitidine).",
  },
  {
    name: "Respiratory Drugs",
    description:
      "Treat asthma, bronchitis, etc. (e.g., salbutamol, budesonide).",
  },
  {
    name: "Vitamins and Supplements",
    description:
      "Essential nutrients supporting overall health (e.g., vitamin C, D3, zinc).",
  },
  {
    name: "Vaccines",
    description:
      "Provide immunity against diseases (e.g., influenza, hepatitis vaccines).",
  },
  {
    name: "Hormonal Drugs",
    description: "Affect hormone balance (e.g., levothyroxine, estrogen).",
  },
  {
    name: "Sedatives and Hypnotics",
    description: "For anxiety and sleep disorders (e.g., diazepam, zolpidem).",
  },
];

export async function seedCategories(prisma: PrismaClient) {
  console.log("🌱 Checking medication categories...");
  const count = await prisma.category.count();
  if (count > 0) {
    console.log(`ℹ️ Found ${count} existing categories — skipping seeding.`);
    return;
  }

  await prisma.category.createMany({
    data: categories,
  });

  console.log(`✅ Seeded ${categories.length} medication categories.`);
}
