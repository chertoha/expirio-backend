// seed-active-ingredients.ts
import { PrismaClient } from "@prisma/client";

const activeIngredients = [
  // Antibiotics
  "Amoxicillin",
  "Azithromycin",
  "Ceftriaxone",
  "Ciprofloxacin",
  "Clarithromycin",
  "Doxycycline",
  "Erythromycin",
  "Levofloxacin",
  "Metronidazole",
  "Vancomycin",

  // Antivirals
  "Acyclovir",
  "Oseltamivir",
  "Remdesivir",
  "Tenofovir",
  "Zidovudine",

  // Antifungals
  "Fluconazole",
  "Itraconazole",
  "Ketoconazole",
  "Terbinafine",
  "Clotrimazole",

  // Analgesics & Anti-inflammatory
  "Paracetamol",
  "Ibuprofen",
  "Diclofenac",
  "Naproxen",
  "Tramadol",
  "Ketorolac",
  "Aspirin",
  "Meloxicam",

  // Antidepressants
  "Fluoxetine",
  "Sertraline",

  // Cardiovascular
  "Amlodipine",
  "Atenolol",
  "Losartan",
  "Lisinopril",
  "Simvastatin",

  // Antidiabetics
  "Metformin",
  "Glimepiride",
  "Insulin",
  "Sitagliptin",
  "Empagliflozin",

  // Gastrointestinal
  "Omeprazole",
  "Pantoprazole",
  "Ranitidine",
  "Domperidone",
  "Loperamide",

  // Vitamins & Supplements
  "Vitamin C",
  "Vitamin D3",
  "Zinc Sulfate",
  "Iron Fumarate",
  "Calcium Carbonate",
  "Magnesium Citrate",
  "Folic Acid",
  "Vitamin B12",
  "Biotin",
  "Omega-3",

  // Antihistamines
  "Loratadine",
  "Cetirizine",
  "Diphenhydramine",
  "Fexofenadine",
  "Chlorpheniramine",

  // Respiratory Drugs
  "Salbutamol",
  "Budesonide",
  "Ambroxol",
  "Montelukast",

  // Hormonal
  "Levothyroxine",
  "Estrogen",

  // Sedatives / Hypnotics
  "Diazepam",
  "Zolpidem",

  // Vaccines
  "Influenza Vaccine",
  "Hepatitis Vaccine",
];

export async function seedActiveIngredients(prisma: PrismaClient) {
  console.log("🌱 Checking active ingredients...");
  const count = await prisma.activeIngredient.count();
  if (count > 0) {
    console.log(
      `ℹ️ Found ${count} existing active ingredients — skipping seeding.`,
    );
    return;
  }

  await prisma.activeIngredient.createMany({
    data: activeIngredients.map(name => ({ name })),
  });

  console.log(`✅ Seeded ${activeIngredients.length} active ingredients.`);
}
