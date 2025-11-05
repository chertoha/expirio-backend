import { PrismaClient } from "@prisma/client";

const categories = [
  {
    name: "Antibiotics",
    description:
      "Medications used to treat bacterial infections, such as amoxicillin or azithromycin.",
  },
  {
    name: "Antivirals",
    description:
      "Drugs used to treat viral infections, including influenza and herpes medications.",
  },
  {
    name: "Analgesics",
    description:
      "Pain-relieving medications such as paracetamol, ibuprofen, or opioids.",
  },
  {
    name: "Anti-inflammatory Drugs",
    description:
      "Medications that reduce inflammation, including corticosteroids and NSAIDs.",
  },
  {
    name: "Antihistamines",
    description:
      "Used to relieve allergic reactions, itching, and nasal congestion.",
  },
  {
    name: "Antidepressants",
    description:
      "Medications for managing depression and anxiety disorders (e.g., SSRIs, SNRIs).",
  },
  {
    name: "Cardiovascular Drugs",
    description:
      "Medications used to treat heart diseases and regulate blood pressure.",
  },
  {
    name: "Antidiabetic Agents",
    description:
      "Drugs used to control blood sugar levels in patients with diabetes.",
  },
  {
    name: "Vitamins and Supplements",
    description:
      "Essential nutrients and dietary supplements to support overall health.",
  },
  {
    name: "Vaccines",
    description:
      "Biological preparations that provide immunity against specific diseases.",
  },
  {
    name: "Antifungal Agents",
    description:
      "Medications used to treat fungal infections of skin, nails, or internal organs.",
  },
  {
    name: "Antiseptics and Disinfectants",
    description:
      "Used to prevent infection by killing or inhibiting the growth of microorganisms.",
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
