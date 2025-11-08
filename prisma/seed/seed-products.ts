// seed-products.ts
import { PrismaClient } from "@prisma/client";

export async function seedProducts(prisma: PrismaClient) {
  console.log("🌱 Checking products...");

  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`ℹ️ Found ${count} existing products — skipping seeding.`);
    return;
  }

  const ingredients = await prisma.activeIngredient.findMany();
  const forms = await prisma.drugForm.findMany();
  const categories = await prisma.category.findMany();
  const units = await prisma.dosageUnit.findMany();

  const findId = (list: any[], name: string) =>
    list.find(i => i.name === name)?.id;

  for (const item of productsData) {
    const ingredientId = findId(ingredients, item.ingredient);
    const formId = findId(forms, item.form);
    const categoryId = findId(categories, item.category);
    const unitId = findId(units, item.unit);

    if (!ingredientId || !formId || !categoryId || !unitId) {
      console.error(`⚠️ Missing reference for product: ${item.name}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: item.name,
        barcode: item.barcode,
        dosage: item.dosage,
        dosageUnitId: unitId,
        activeIngredientId: ingredientId,
        categories: { create: [{ categoryId }] },
        forms: { create: [{ formId }] },
      },
    });
  }

  console.log(`✅ Seeded ${productsData.length} products.`);
}

const productsData = [
  {
    name: "Salbutamol Inhaler 100mcg",
    ingredient: "Salbutamol",
    category: "Respiratory Drugs",
    form: "Inhaler",
    dosage: 100,
    unit: "mcg",
    barcode: "1000000000024",
  },
  {
    name: "Budesonide 200mcg Inhaler",
    ingredient: "Budesonide",
    category: "Respiratory Drugs",
    form: "Inhaler",
    dosage: 200,
    unit: "mcg",
    barcode: "1000000000025",
  },

  // Hormonal Drugs
  {
    name: "Levothyroxine 25mcg Tablet",
    ingredient: "Levothyroxine",
    category: "Hormonal Drugs",
    form: "Tablet",
    dosage: 25,
    unit: "mcg",
    barcode: "1000000000026",
  },
  {
    name: "Estrogen 2mg Tablet",
    ingredient: "Estrogen",
    category: "Hormonal Drugs",
    form: "Tablet",
    dosage: 2,
    unit: "mg",
    barcode: "1000000000027",
  },

  // Sedatives and Hypnotics
  {
    name: "Diazepam 5mg Tablet",
    ingredient: "Diazepam",
    category: "Sedatives and Hypnotics",
    form: "Tablet",
    dosage: 5,
    unit: "mg",
    barcode: "1000000000028",
  },
  {
    name: "Zolpidem 10mg Tablet",
    ingredient: "Zolpidem",
    category: "Sedatives and Hypnotics",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000029",
  },

  // Vaccines
  {
    name: "Influenza Vaccine 0.5ml Injection",
    ingredient: "Influenza Vaccine",
    category: "Vaccines",
    form: "Injection",
    dosage: 0.5,
    unit: "ml",
    barcode: "1000000000030",
  },
  {
    name: "Hepatitis B Vaccine 1ml Injection",
    ingredient: "Hepatitis Vaccine",
    category: "Vaccines",
    form: "Injection",
    dosage: 1,
    unit: "ml",
    barcode: "1000000000031",
  },

  // Cardiovascular (ещё примеры)
  {
    name: "Losartan 50mg Tablet",
    ingredient: "Losartan",
    category: "Cardiovascular Drugs",
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000032",
  },
  {
    name: "Simvastatin 20mg Tablet",
    ingredient: "Simvastatin",
    category: "Cardiovascular Drugs",
    form: "Tablet",
    dosage: 20,
    unit: "mg",
    barcode: "1000000000033",
  },

  // Anti-inflammatory / Analgesic дополнительно
  {
    name: "Aspirin 100mg Tablet",
    ingredient: "Aspirin",
    category: "Anti-inflammatory Drugs",
    form: "Tablet",
    dosage: 100,
    unit: "mg",
    barcode: "1000000000034",
  },
  {
    name: "Meloxicam 15mg Tablet",
    ingredient: "Meloxicam",
    category: "Anti-inflammatory Drugs",
    form: "Tablet",
    dosage: 15,
    unit: "mg",
    barcode: "1000000000035",
  },

  // Gastrointestinal
  {
    name: "Pantoprazole 40mg Tablet",
    ingredient: "Pantoprazole",
    category: "Gastrointestinal Drugs",
    form: "Tablet",
    dosage: 40,
    unit: "mg",
    barcode: "1000000000036",
  },
  {
    name: "Domperidone 10mg Tablet",
    ingredient: "Domperidone",
    category: "Gastrointestinal Drugs",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000037",
  },

  // Antifungal / Topical
  {
    name: "Ketoconazole 2% Shampoo",
    ingredient: "Ketoconazole",
    category: "Antifungals",
    form: "Solution",
    dosage: 2,
    unit: "g",
    barcode: "1000000000038",
  },
  {
    name: "Terbinafine 250mg Tablet",
    ingredient: "Terbinafine",
    category: "Antifungals",
    form: "Tablet",
    dosage: 250,
    unit: "mg",
    barcode: "1000000000039",
  },

  // Antibiotics (дополнительно)
  {
    name: "Ciprofloxacin 500mg Tablet",
    ingredient: "Ciprofloxacin",
    category: "Antibiotics",
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000040",
  },
  {
    name: "Doxycycline 100mg Capsule",
    ingredient: "Doxycycline",
    category: "Antibiotics",
    form: "Capsule",
    dosage: 100,
    unit: "mg",
    barcode: "1000000000041",
  },

  // Antidiabetic Agents (ещё варианты)
  {
    name: "Glimepiride 2mg Tablet",
    ingredient: "Glimepiride",
    category: "Antidiabetic Agents",
    form: "Tablet",
    dosage: 2,
    unit: "mg",
    barcode: "1000000000042",
  },
  {
    name: "Sitagliptin 100mg Tablet",
    ingredient: "Sitagliptin",
    category: "Antidiabetic Agents",
    form: "Tablet",
    dosage: 100,
    unit: "mg",
    barcode: "1000000000043",
  },

  // Antihistamines (ещё варианты)
  {
    name: "Fexofenadine 120mg Tablet",
    ingredient: "Fexofenadine",
    category: "Antihistamines",
    form: "Tablet",
    dosage: 120,
    unit: "mg",
    barcode: "1000000000044",
  },
  {
    name: "Diphenhydramine 25mg Capsule",
    ingredient: "Diphenhydramine",
    category: "Antihistamines",
    form: "Capsule",
    dosage: 25,
    unit: "mg",
    barcode: "1000000000045",
  },

  // Vitamins (ещё варианты)
  {
    name: "Vitamin B12 1000mcg Injection",
    ingredient: "Vitamin B12",
    category: "Vitamins and Supplements",
    form: "Injection",
    dosage: 1000,
    unit: "mcg",
    barcode: "1000000000046",
  },
  {
    name: "Folic Acid 5mg Tablet",
    ingredient: "Folic Acid",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 5,
    unit: "mg",
    barcode: "1000000000047",
  },

  // Respiratory Drugs
  {
    name: "Ambroxol 30mg Syrup",
    ingredient: "Ambroxol",
    category: "Respiratory Drugs",
    form: "Syrup",
    dosage: 30,
    unit: "mg",
    barcode: "1000000000048",
  },
  {
    name: "Montelukast 10mg Tablet",
    ingredient: "Montelukast",
    category: "Respiratory Drugs",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000049",
  },

  // Additional common drugs
  {
    name: "Zinc Sulfate 220mg Tablet",
    ingredient: "Zinc Sulfate",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 220,
    unit: "mg",
    barcode: "1000000000050",
  },
  {
    name: "Magnesium Citrate 300mg Tablet",
    ingredient: "Magnesium Citrate",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 300,
    unit: "mg",
    barcode: "1000000000051",
  },
  {
    name: "Iron Fumarate 200mg Tablet",
    ingredient: "Iron Fumarate",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 200,
    unit: "mg",
    barcode: "1000000000052",
  },
  {
    name: "Calcium Carbonate 500mg Tablet",
    ingredient: "Calcium Carbonate",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000053",
  },

  // Antibiotics
  {
    name: "Amoxicillin 500mg Capsule",
    ingredient: "Amoxicillin",
    category: "Antibiotics",
    form: "Capsule",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000001",
  },
  {
    name: "Azithromycin 250mg Tablet",
    ingredient: "Azithromycin",
    category: "Antibiotics",
    form: "Tablet",
    dosage: 250,
    unit: "mg",
    barcode: "1000000000002",
  },
  {
    name: "Ceftriaxone 1g Injection",
    ingredient: "Ceftriaxone",
    category: "Antibiotics",
    form: "Injection",
    dosage: 1,
    unit: "g",
    barcode: "1000000000003",
  },

  // Antivirals
  {
    name: "Acyclovir 200mg Tablet",
    ingredient: "Acyclovir",
    category: "Antivirals",
    form: "Tablet",
    dosage: 200,
    unit: "mg",
    barcode: "1000000000004",
  },
  {
    name: "Oseltamivir 75mg Capsule",
    ingredient: "Oseltamivir",
    category: "Antivirals",
    form: "Capsule",
    dosage: 75,
    unit: "mg",
    barcode: "1000000000005",
  },

  // Antifungals
  {
    name: "Fluconazole 150mg Capsule",
    ingredient: "Fluconazole",
    category: "Antifungals",
    form: "Capsule",
    dosage: 150,
    unit: "mg",
    barcode: "1000000000006",
  },
  {
    name: "Clotrimazole 1% Cream",
    ingredient: "Clotrimazole",
    category: "Antifungals",
    form: "Cream",
    dosage: 1,
    unit: "g",
    barcode: "1000000000007",
  },

  // Analgesics
  {
    name: "Paracetamol 500mg Tablet",
    ingredient: "Paracetamol",
    category: "Analgesics",
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000008",
  },
  {
    name: "Ibuprofen 400mg Tablet",
    ingredient: "Ibuprofen",
    category: "Analgesics",
    form: "Tablet",
    dosage: 400,
    unit: "mg",
    barcode: "1000000000009",
  },

  // Anti-inflammatory
  {
    name: "Diclofenac 50mg Tablet",
    ingredient: "Diclofenac",
    category: "Anti-inflammatory Drugs",
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000010",
  },
  {
    name: "Naproxen 250mg Tablet",
    ingredient: "Naproxen",
    category: "Anti-inflammatory Drugs",
    form: "Tablet",
    dosage: 250,
    unit: "mg",
    barcode: "1000000000011",
  },

  // Antihistamines
  {
    name: "Loratadine 10mg Tablet",
    ingredient: "Loratadine",
    category: "Antihistamines",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000012",
  },
  {
    name: "Cetirizine 10mg Tablet",
    ingredient: "Cetirizine",
    category: "Antihistamines",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000013",
  },

  // Antidepressants
  {
    name: "Fluoxetine 20mg Capsule",
    ingredient: "Fluoxetine",
    category: "Antidepressants",
    form: "Capsule",
    dosage: 20,
    unit: "mg",
    barcode: "1000000000014",
  },
  {
    name: "Sertraline 50mg Tablet",
    ingredient: "Sertraline",
    category: "Antidepressants",
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000015",
  },

  // Cardiovascular
  {
    name: "Amlodipine 5mg Tablet",
    ingredient: "Amlodipine",
    category: "Cardiovascular Drugs",
    form: "Tablet",
    dosage: 5,
    unit: "mg",
    barcode: "1000000000016",
  },
  {
    name: "Atenolol 50mg Tablet",
    ingredient: "Atenolol",
    category: "Cardiovascular Drugs",
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000017",
  },

  // Antidiabetic
  {
    name: "Metformin 500mg Tablet",
    ingredient: "Metformin",
    category: "Antidiabetic Agents",
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000018",
  },
  {
    name: "Insulin 100 IU Injection",
    ingredient: "Insulin",
    category: "Antidiabetic Agents",
    form: "Injection",
    dosage: 100,
    unit: "IU",
    barcode: "1000000000019",
  },

  // Gastrointestinal
  {
    name: "Omeprazole 20mg Capsule",
    ingredient: "Omeprazole",
    category: "Gastrointestinal Drugs",
    form: "Capsule",
    dosage: 20,
    unit: "mg",
    barcode: "1000000000020",
  },
  {
    name: "Ranitidine 150mg Tablet",
    ingredient: "Ranitidine",
    category: "Gastrointestinal Drugs",
    form: "Tablet",
    dosage: 150,
    unit: "mg",
    barcode: "1000000000021",
  },

  // Vitamins
  {
    name: "Vitamin C 500mg Tablet",
    ingredient: "Vitamin C",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000022",
  },
  {
    name: "Vitamin D3 1000 IU Capsule",
    ingredient: "Vitamin D3",
    category: "Vitamins and Supplements",
    form: "Capsule",
    dosage: 1000,
    unit: "IU",
    barcode: "1000000000023",
  },
];

// const productsData = [
// // Antibiotics
// {
//   name: "Amoxicillin 500mg Capsule",
//   ingredient: "Amoxicillin",
//   category: "Antibiotics",
//   form: "Capsule",
//   dosage: 500,
//   unit: "mg",
//   barcode: "1000000000001",
// },
// {
//   name: "Azithromycin 250mg Tablet",
//   ingredient: "Azithromycin",
//   category: "Antibiotics",
//   form: "Tablet",
//   dosage: 250,
//   unit: "mg",
//   barcode: "1000000000002",
// },
// {
//   name: "Ceftriaxone 1g Injection",
//   ingredient: "Ceftriaxone",
//   category: "Antibiotics",
//   form: "Injection",
//   dosage: 1,
//   unit: "g",
//   barcode: "1000000000003",
// },

// // Antivirals
// {
//   name: "Acyclovir 200mg Tablet",
//   ingredient: "Acyclovir",
//   category: "Antivirals",
//   form: "Tablet",
//   dosage: 200,
//   unit: "mg",
//   barcode: "1000000000004",
// },
// {
//   name: "Oseltamivir 75mg Capsule",
//   ingredient: "Oseltamivir",
//   category: "Antivirals",
//   form: "Capsule",
//   dosage: 75,
//   unit: "mg",
//   barcode: "1000000000005",
// },

// // Antifungals
// {
//   name: "Fluconazole 150mg Capsule",
//   ingredient: "Fluconazole",
//   category: "Antifungals",
//   form: "Capsule",
//   dosage: 150,
//   unit: "mg",
//   barcode: "1000000000006",
// },
// {
//   name: "Clotrimazole 1% Cream",
//   ingredient: "Clotrimazole",
//   category: "Antifungals",
//   form: "Cream",
//   dosage: 1,
//   unit: "g",
//   barcode: "1000000000007",
// },

// // Analgesics
// {
//   name: "Paracetamol 500mg Tablet",
//   ingredient: "Paracetamol",
//   category: "Analgesics",
//   form: "Tablet",
//   dosage: 500,
//   unit: "mg",
//   barcode: "1000000000008",
// },
// {
//   name: "Ibuprofen 400mg Tablet",
//   ingredient: "Ibuprofen",
//   category: "Analgesics",
//   form: "Tablet",
//   dosage: 400,
//   unit: "mg",
//   barcode: "1000000000009",
// },

// // Anti-inflammatory
// {
//   name: "Diclofenac 50mg Tablet",
//   ingredient: "Diclofenac",
//   category: "Anti-inflammatory Drugs",
//   form: "Tablet",
//   dosage: 50,
//   unit: "mg",
//   barcode: "1000000000010",
// },
// {
//   name: "Naproxen 250mg Tablet",
//   ingredient: "Naproxen",
//   category: "Anti-inflammatory Drugs",
//   form: "Tablet",
//   dosage: 250,
//   unit: "mg",
//   barcode: "1000000000011",
// },

// // Antihistamines
// {
//   name: "Loratadine 10mg Tablet",
//   ingredient: "Loratadine",
//   category: "Antihistamines",
//   form: "Tablet",
//   dosage: 10,
//   unit: "mg",
//   barcode: "1000000000012",
// },
// {
//   name: "Cetirizine 10mg Tablet",
//   ingredient: "Cetirizine",
//   category: "Antihistamines",
//   form: "Tablet",
//   dosage: 10,
//   unit: "mg",
//   barcode: "1000000000013",
// },

// // Antidepressants
// {
//   name: "Fluoxetine 20mg Capsule",
//   ingredient: "Fluoxetine",
//   category: "Antidepressants",
//   form: "Capsule",
//   dosage: 20,
//   unit: "mg",
//   barcode: "1000000000014",
// },
// {
//   name: "Sertraline 50mg Tablet",
//   ingredient: "Sertraline",
//   category: "Antidepressants",
//   form: "Tablet",
//   dosage: 50,
//   unit: "mg",
//   barcode: "1000000000015",
// },

// // Cardiovascular
// {
//   name: "Amlodipine 5mg Tablet",
//   ingredient: "Amlodipine",
//   category: "Cardiovascular Drugs",
//   form: "Tablet",
//   dosage: 5,
//   unit: "mg",
//   barcode: "1000000000016",
// },
// {
//   name: "Atenolol 50mg Tablet",
//   ingredient: "Atenolol",
//   category: "Cardiovascular Drugs",
//   form: "Tablet",
//   dosage: 50,
//   unit: "mg",
//   barcode: "1000000000017",
// },

// // Antidiabetic
// {
//   name: "Metformin 500mg Tablet",
//   ingredient: "Metformin",
//   category: "Antidiabetic Agents",
//   form: "Tablet",
//   dosage: 500,
//   unit: "mg",
//   barcode: "1000000000018",
// },
// {
//   name: "Insulin 100 IU Injection",
//   ingredient: "Insulin",
//   category: "Antidiabetic Agents",
//   form: "Injection",
//   dosage: 100,
//   unit: "IU",
//   barcode: "1000000000019",
// },

// // Gastrointestinal
// {
//   name: "Omeprazole 20mg Capsule",
//   ingredient: "Omeprazole",
//   category: "Gastrointestinal Drugs",
//   form: "Capsule",
//   dosage: 20,
//   unit: "mg",
//   barcode: "1000000000020",
// },
// {
//   name: "Ranitidine 150mg Tablet",
//   ingredient: "Ranitidine",
//   category: "Gastrointestinal Drugs",
//   form: "Tablet",
//   dosage: 150,
//   unit: "mg",
//   barcode: "1000000000021",
// },

// // Vitamins
// {
//   name: "Vitamin C 500mg Tablet",
//   ingredient: "Vitamin C",
//   category: "Vitamins and Supplements",
//   form: "Tablet",
//   dosage: 500,
//   unit: "mg",
//   barcode: "1000000000022",
// },
// {
//   name: "Vitamin D3 1000 IU Capsule",
//   ingredient: "Vitamin D3",
//   category: "Vitamins and Supplements",
//   form: "Capsule",
//   dosage: 1000,
//   unit: "IU",
//   barcode: "1000000000023",
// },
// ];
