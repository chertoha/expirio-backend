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
    const unitId = findId(units, item.unit);

    if (!ingredientId || !formId || !unitId) {
      console.error(`⚠️ Missing reference for product: ${item.name}`);
      continue;
    }

    // Преобразуем строку category → массив categories
    const categoryNames = Array.isArray(item.categories)
      ? item.categories
      : [item.category];

    // const categoryIds = categoryNames
    //   .map(name => findId(categories, name))
    //   .filter(Boolean) as number[];
    const categoryIds = categoryNames
      .filter((name): name is string => Boolean(name)) // ✅ убираем undefined
      .map(name => findId(categories, name))
      .filter(Boolean) as number[];

    if (categoryIds.length === 0) {
      console.error(`⚠️ No valid categories for product: ${item.name}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: item.name,
        barcode: item.barcode,
        dosage: item.dosage,
        dosageUnitId: unitId,
        activeIngredientId: ingredientId,
        categories: {
          create: categoryIds.map(categoryId => ({ categoryId })),
        },
        forms: { create: [{ formId }] },
      },
    });
  }

  console.log(`✅ Seeded ${productsData.length} products.`);
}

export const productsData = [
  // Respiratory Drugs
  {
    name: "Ventolin Inhaler 100mcg",
    ingredient: "Salbutamol",
    category: "Respiratory Drugs",
    form: "Inhaler",
    dosage: 100,
    unit: "mcg",
    barcode: "1000000000024",
  },
  {
    name: "Pulmicort Inhaler 200mcg",
    ingredient: "Budesonide",
    category: "Respiratory Drugs",
    form: "Inhaler",
    dosage: 200,
    unit: "mcg",
    barcode: "1000000000025",
  },

  // Hormonal Drugs
  {
    name: "Euthyrox 25mcg Tablet",
    ingredient: "Levothyroxine",
    category: "Hormonal Drugs",
    form: "Tablet",
    dosage: 25,
    unit: "mcg",
    barcode: "1000000000026",
  },
  {
    name: "Premarin 2mg Tablet",
    ingredient: "Estrogen",
    category: "Hormonal Drugs",
    form: "Tablet",
    dosage: 2,
    unit: "mg",
    barcode: "1000000000027",
  },

  // Sedatives and Hypnotics
  {
    name: "Valium 5mg Tablet",
    ingredient: "Diazepam",
    category: "Sedatives and Hypnotics",
    form: "Tablet",
    dosage: 5,
    unit: "mg",
    barcode: "1000000000028",
  },
  {
    name: "Ambien 10mg Tablet",
    ingredient: "Zolpidem",
    category: "Sedatives and Hypnotics",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000029",
  },

  // Vaccines
  {
    name: "Vaxigrip 0.5ml Injection",
    ingredient: "Influenza Vaccine",
    category: "Vaccines",
    form: "Injection",
    dosage: 0.5,
    unit: "ml",
    barcode: "1000000000030",
  },
  {
    name: "Engerix-B 1ml Injection",
    ingredient: "Hepatitis Vaccine",
    category: "Vaccines",
    form: "Injection",
    dosage: 1,
    unit: "ml",
    barcode: "1000000000031",
  },

  // Cardiovascular
  {
    name: "Lozartan Teva 50mg Tablet",
    ingredient: "Losartan",
    category: "Cardiovascular Drugs",
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000032",
  },
  {
    name: "Zocor 20mg Tablet",
    ingredient: "Simvastatin",
    category: "Cardiovascular Drugs",
    form: "Tablet",
    dosage: 20,
    unit: "mg",
    barcode: "1000000000033",
  },

  // Anti-inflammatory / Analgesic
  {
    name: "Aspirin Cardio 100mg Tablet",
    ingredient: "Aspirin",
    categories: [
      "Cardiovascular Drugs",
      "Analgesics",
      "Anti-inflammatory Drugs",
    ],
    form: "Tablet",
    dosage: 100,
    unit: "mg",
    barcode: "1000000000034",
  },
  {
    name: "Movalis 15mg Tablet",
    ingredient: "Meloxicam",
    categories: ["Anti-inflammatory Drugs", "Analgesics"],
    form: "Tablet",
    dosage: 15,
    unit: "mg",
    barcode: "1000000000035",
  },

  // Gastrointestinal
  {
    name: "Controloc 40mg Tablet",
    ingredient: "Pantoprazole",
    category: "Gastrointestinal Drugs",
    form: "Tablet",
    dosage: 40,
    unit: "mg",
    barcode: "1000000000036",
  },
  {
    name: "Motilium 10mg Tablet",
    ingredient: "Domperidone",
    category: "Gastrointestinal Drugs",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000037",
  },

  // Antifungal / Topical
  {
    name: "Nizoral 2% Shampoo",
    ingredient: "Ketoconazole",
    categories: ["Antifungals", "Topical Treatments", "Dermatological Agents"],
    form: "Solution",
    dosage: 2,
    unit: "g",
    barcode: "1000000000038",
  },
  {
    name: "Lamisil 250mg Tablet",
    ingredient: "Terbinafine",
    categories: ["Antifungals", "Topical Treatments"],
    form: "Tablet",
    dosage: 250,
    unit: "mg",
    barcode: "1000000000039",
  },

  // Antibiotics
  {
    name: "Ciprolet 500mg Tablet",
    ingredient: "Ciprofloxacin",
    category: "Antibiotics",
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000040",
  },
  {
    name: "Doxy-M 100mg Capsule",
    ingredient: "Doxycycline",
    category: "Antibiotics",
    form: "Capsule",
    dosage: 100,
    unit: "mg",
    barcode: "1000000000041",
  },

  // Antidiabetic Agents
  {
    name: "Amaryl 2mg Tablet",
    ingredient: "Glimepiride",
    category: "Antidiabetic Agents",
    form: "Tablet",
    dosage: 2,
    unit: "mg",
    barcode: "1000000000042",
  },
  {
    name: "Januvia 100mg Tablet",
    ingredient: "Sitagliptin",
    category: "Antidiabetic Agents",
    form: "Tablet",
    dosage: 100,
    unit: "mg",
    barcode: "1000000000043",
  },
  {
    name: "Glucophage 500mg Tablet",
    ingredient: "Metformin",
    categories: ["Antidiabetic Agents", "Cardiovascular Drugs"],
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000018",
  },
  {
    name: "Humulin 100 IU Injection",
    ingredient: "Insulin",
    category: "Antidiabetic Agents",
    form: "Injection",
    dosage: 100,
    unit: "IU",
    barcode: "1000000000019",
  },

  // Antihistamines
  {
    name: "Telfast 120mg Tablet",
    ingredient: "Fexofenadine",
    categories: ["Antihistamines", "Respiratory Drugs"],
    form: "Tablet",
    dosage: 120,
    unit: "mg",
    barcode: "1000000000044",
  },
  {
    name: "Benadryl 25mg Capsule",
    ingredient: "Diphenhydramine",
    category: "Antihistamines",
    form: "Capsule",
    dosage: 25,
    unit: "mg",
    barcode: "1000000000045",
  },
  {
    name: "Claritin 10mg Tablet",
    ingredient: "Loratadine",
    category: "Antihistamines",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000012",
  },
  {
    name: "Zyrtec 10mg Tablet",
    ingredient: "Cetirizine",
    categories: ["Antihistamines", "Respiratory Drugs"],
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000013",
  },

  // Vitamins and Supplements
  {
    name: "Neurobion B12 Injection 1000mcg",
    ingredient: "Vitamin B12",
    categories: ["Vitamins and Supplements", "Neurological Agents"],
    form: "Injection",
    dosage: 1000,
    unit: "mcg",
    barcode: "1000000000046",
  },
  {
    name: "Folacin 5mg Tablet",
    ingredient: "Folic Acid",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 5,
    unit: "mg",
    barcode: "1000000000047",
  },
  {
    name: "Zincteral 220mg Tablet",
    ingredient: "Zinc Sulfate",
    categories: ["Vitamins and Supplements", "Immunity Boosters"],
    form: "Tablet",
    dosage: 220,
    unit: "mg",
    barcode: "1000000000050",
  },
  {
    name: "Magnelis B6 300mg Tablet",
    ingredient: "Magnesium Citrate",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 300,
    unit: "mg",
    barcode: "1000000000051",
  },
  {
    name: "Ferretab 200mg Tablet",
    ingredient: "Iron Fumarate",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 200,
    unit: "mg",
    barcode: "1000000000052",
  },
  {
    name: "Calcium D3 Nycomed 500mg Tablet",
    ingredient: "Calcium Carbonate",
    category: "Vitamins and Supplements",
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000053",
  },
  {
    name: "Redoxon 500mg Tablet",
    ingredient: "Vitamin C",
    categories: ["Vitamins and Supplements", "Immunity Boosters"],
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000022",
  },
  {
    name: "Vigantol 1000 IU Capsule",
    ingredient: "Vitamin D3",
    categories: ["Vitamins and Supplements", "Bone Health"],
    form: "Capsule",
    dosage: 1000,
    unit: "IU",
    barcode: "1000000000023",
  },

  // Respiratory / additional
  {
    name: "Ambrobene Syrup 30mg/5ml",
    ingredient: "Ambroxol",
    category: "Respiratory Drugs",
    form: "Syrup",
    dosage: 30,
    unit: "mg",
    barcode: "1000000000048",
  },
  {
    name: "Singulair 10mg Tablet",
    ingredient: "Montelukast",
    category: "Respiratory Drugs",
    form: "Tablet",
    dosage: 10,
    unit: "mg",
    barcode: "1000000000049",
  },

  // Antivirals
  {
    name: "Zovirax 200mg Tablet",
    ingredient: "Acyclovir",
    category: "Antivirals",
    form: "Tablet",
    dosage: 200,
    unit: "mg",
    barcode: "1000000000004",
  },
  {
    name: "Tamiflu 75mg Capsule",
    ingredient: "Oseltamivir",
    categories: ["Antivirals", "Respiratory Drugs"],
    form: "Capsule",
    dosage: 75,
    unit: "mg",
    barcode: "1000000000005",
  },

  // Analgesics
  {
    name: "Panadol 500mg Tablet",
    ingredient: "Paracetamol",
    categories: ["Analgesics", "Anti-inflammatory Drugs"],
    form: "Tablet",
    dosage: 500,
    unit: "mg",
    barcode: "1000000000008",
  },
  {
    name: "Nurofen 400mg Tablet",
    ingredient: "Ibuprofen",
    categories: ["Analgesics", "Anti-inflammatory Drugs"],
    form: "Tablet",
    dosage: 400,
    unit: "mg",
    barcode: "1000000000009",
  },
  {
    name: "Voltaren 50mg Tablet",
    ingredient: "Diclofenac",
    categories: ["Anti-inflammatory Drugs", "Analgesics"],
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000010",
  },
  {
    name: "Naprosyn 250mg Tablet",
    ingredient: "Naproxen",
    category: "Anti-inflammatory Drugs",
    form: "Tablet",
    dosage: 250,
    unit: "mg",
    barcode: "1000000000011",
  },

  // Antidepressants
  {
    name: "Prozac 20mg Capsule",
    ingredient: "Fluoxetine",
    categories: ["Antidepressants", "Sedatives and Hypnotics"],
    form: "Capsule",
    dosage: 20,
    unit: "mg",
    barcode: "1000000000014",
  },
  {
    name: "Zoloft 50mg Tablet",
    ingredient: "Sertraline",
    categories: ["Antidepressants", "Sedatives and Hypnotics"],
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000015",
  },

  // Cardiovascular (extra)
  {
    name: "Norvasc 5mg Tablet",
    ingredient: "Amlodipine",
    categories: ["Cardiovascular Drugs", "Antihypertensives"],
    form: "Tablet",
    dosage: 5,
    unit: "mg",
    barcode: "1000000000016",
  },
  {
    name: "Tenormin 50mg Tablet",
    ingredient: "Atenolol",
    categories: ["Cardiovascular Drugs", "Antihypertensives"],
    form: "Tablet",
    dosage: 50,
    unit: "mg",
    barcode: "1000000000017",
  },
];

// // seed-products.ts
// import { PrismaClient } from "@prisma/client";

// export async function seedProducts(prisma: PrismaClient) {
//   console.log("🌱 Checking products...");

//   const count = await prisma.product.count();
//   if (count > 0) {
//     console.log(`ℹ️ Found ${count} existing products — skipping seeding.`);
//     return;
//   }

//   const ingredients = await prisma.activeIngredient.findMany();
//   const forms = await prisma.drugForm.findMany();
//   const categories = await prisma.category.findMany();
//   const units = await prisma.dosageUnit.findMany();

//   const findId = (list: any[], name: string) =>
//     list.find(i => i.name === name)?.id;

//   for (const item of productsData) {
//     const ingredientId = findId(ingredients, item.ingredient);
//     const formId = findId(forms, item.form);
//     const categoryId = findId(categories, item.category);
//     const unitId = findId(units, item.unit);

//     if (!ingredientId || !formId || !categoryId || !unitId) {
//       console.error(`⚠️ Missing reference for product: ${item.name}`);
//       continue;
//     }

//     await prisma.product.create({
//       data: {
//         name: item.name,
//         barcode: item.barcode,
//         dosage: item.dosage,
//         dosageUnitId: unitId,
//         activeIngredientId: ingredientId,
//         categories: { create: [{ categoryId }] },
//         forms: { create: [{ formId }] },
//       },
//     });
//   }

//   console.log(`✅ Seeded ${productsData.length} products.`);
// }

// const productsData = [
//   // Respiratory Drugs
//   {
//     name: "Ventolin Inhaler 100mcg",
//     ingredient: "Salbutamol",
//     category: "Respiratory Drugs",
//     form: "Inhaler",
//     dosage: 100,
//     unit: "mcg",
//     barcode: "1000000000024",
//   },
//   {
//     name: "Pulmicort Inhaler 200mcg",
//     ingredient: "Budesonide",
//     category: "Respiratory Drugs",
//     form: "Inhaler",
//     dosage: 200,
//     unit: "mcg",
//     barcode: "1000000000025",
//   },

//   // Hormonal Drugs
//   {
//     name: "Euthyrox 25mcg Tablet",
//     ingredient: "Levothyroxine",
//     category: "Hormonal Drugs",
//     form: "Tablet",
//     dosage: 25,
//     unit: "mcg",
//     barcode: "1000000000026",
//   },
//   {
//     name: "Premarin 2mg Tablet",
//     ingredient: "Estrogen",
//     category: "Hormonal Drugs",
//     form: "Tablet",
//     dosage: 2,
//     unit: "mg",
//     barcode: "1000000000027",
//   },

//   // Sedatives and Hypnotics
//   {
//     name: "Valium 5mg Tablet",
//     ingredient: "Diazepam",
//     category: "Sedatives and Hypnotics",
//     form: "Tablet",
//     dosage: 5,
//     unit: "mg",
//     barcode: "1000000000028",
//   },
//   {
//     name: "Ambien 10mg Tablet",
//     ingredient: "Zolpidem",
//     category: "Sedatives and Hypnotics",
//     form: "Tablet",
//     dosage: 10,
//     unit: "mg",
//     barcode: "1000000000029",
//   },

//   // Vaccines
//   {
//     name: "Vaxigrip 0.5ml Injection",
//     ingredient: "Influenza Vaccine",
//     category: "Vaccines",
//     form: "Injection",
//     dosage: 0.5,
//     unit: "ml",
//     barcode: "1000000000030",
//   },
//   {
//     name: "Engerix-B 1ml Injection",
//     ingredient: "Hepatitis Vaccine",
//     category: "Vaccines",
//     form: "Injection",
//     dosage: 1,
//     unit: "ml",
//     barcode: "1000000000031",
//   },

//   // Cardiovascular
//   {
//     name: "Lozartan Teva 50mg Tablet",
//     ingredient: "Losartan",
//     category: "Cardiovascular Drugs",
//     form: "Tablet",
//     dosage: 50,
//     unit: "mg",
//     barcode: "1000000000032",
//   },
//   {
//     name: "Zocor 20mg Tablet",
//     ingredient: "Simvastatin",
//     category: "Cardiovascular Drugs",
//     form: "Tablet",
//     dosage: 20,
//     unit: "mg",
//     barcode: "1000000000033",
//   },

//   // Anti-inflammatory / Analgesic
//   {
//     name: "Aspirin Cardio 100mg Tablet",
//     ingredient: "Aspirin",
//     category: "Anti-inflammatory Drugs",
//     form: "Tablet",
//     dosage: 100,
//     unit: "mg",
//     barcode: "1000000000034",
//   },
//   {
//     name: "Movalis 15mg Tablet",
//     ingredient: "Meloxicam",
//     category: "Anti-inflammatory Drugs",
//     form: "Tablet",
//     dosage: 15,
//     unit: "mg",
//     barcode: "1000000000035",
//   },

//   // Gastrointestinal
//   {
//     name: "Controloc 40mg Tablet",
//     ingredient: "Pantoprazole",
//     category: "Gastrointestinal Drugs",
//     form: "Tablet",
//     dosage: 40,
//     unit: "mg",
//     barcode: "1000000000036",
//   },
//   {
//     name: "Motilium 10mg Tablet",
//     ingredient: "Domperidone",
//     category: "Gastrointestinal Drugs",
//     form: "Tablet",
//     dosage: 10,
//     unit: "mg",
//     barcode: "1000000000037",
//   },

//   // Antifungal / Topical
//   {
//     name: "Nizoral 2% Shampoo",
//     ingredient: "Ketoconazole",
//     category: "Antifungals",
//     form: "Solution",
//     dosage: 2,
//     unit: "g",
//     barcode: "1000000000038",
//   },
//   {
//     name: "Lamisil 250mg Tablet",
//     ingredient: "Terbinafine",
//     category: "Antifungals",
//     form: "Tablet",
//     dosage: 250,
//     unit: "mg",
//     barcode: "1000000000039",
//   },

//   // Antibiotics
//   {
//     name: "Ciprolet 500mg Tablet",
//     ingredient: "Ciprofloxacin",
//     category: "Antibiotics",
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000040",
//   },
//   {
//     name: "Doxy-M 100mg Capsule",
//     ingredient: "Doxycycline",
//     category: "Antibiotics",
//     form: "Capsule",
//     dosage: 100,
//     unit: "mg",
//     barcode: "1000000000041",
//   },

//   // Antidiabetic Agents
//   {
//     name: "Amaryl 2mg Tablet",
//     ingredient: "Glimepiride",
//     category: "Antidiabetic Agents",
//     form: "Tablet",
//     dosage: 2,
//     unit: "mg",
//     barcode: "1000000000042",
//   },
//   {
//     name: "Januvia 100mg Tablet",
//     ingredient: "Sitagliptin",
//     category: "Antidiabetic Agents",
//     form: "Tablet",
//     dosage: 100,
//     unit: "mg",
//     barcode: "1000000000043",
//   },

//   // Antihistamines
//   {
//     name: "Telfast 120mg Tablet",
//     ingredient: "Fexofenadine",
//     category: "Antihistamines",
//     form: "Tablet",
//     dosage: 120,
//     unit: "mg",
//     barcode: "1000000000044",
//   },
//   {
//     name: "Benadryl 25mg Capsule",
//     ingredient: "Diphenhydramine",
//     category: "Antihistamines",
//     form: "Capsule",
//     dosage: 25,
//     unit: "mg",
//     barcode: "1000000000045",
//   },

//   // Vitamins and Supplements
//   {
//     name: "Neurobion B12 Injection 1000mcg",
//     ingredient: "Vitamin B12",
//     category: "Vitamins and Supplements",
//     form: "Injection",
//     dosage: 1000,
//     unit: "mcg",
//     barcode: "1000000000046",
//   },
//   {
//     name: "Folacin 5mg Tablet",
//     ingredient: "Folic Acid",
//     category: "Vitamins and Supplements",
//     form: "Tablet",
//     dosage: 5,
//     unit: "mg",
//     barcode: "1000000000047",
//   },
//   {
//     name: "Ambrobene Syrup 30mg/5ml",
//     ingredient: "Ambroxol",
//     category: "Respiratory Drugs",
//     form: "Syrup",
//     dosage: 30,
//     unit: "mg",
//     barcode: "1000000000048",
//   },
//   {
//     name: "Singulair 10mg Tablet",
//     ingredient: "Montelukast",
//     category: "Respiratory Drugs",
//     form: "Tablet",
//     dosage: 10,
//     unit: "mg",
//     barcode: "1000000000049",
//   },
//   {
//     name: "Zincteral 220mg Tablet",
//     ingredient: "Zinc Sulfate",
//     category: "Vitamins and Supplements",
//     form: "Tablet",
//     dosage: 220,
//     unit: "mg",
//     barcode: "1000000000050",
//   },
//   {
//     name: "Magnelis B6 300mg Tablet",
//     ingredient: "Magnesium Citrate",
//     category: "Vitamins and Supplements",
//     form: "Tablet",
//     dosage: 300,
//     unit: "mg",
//     barcode: "1000000000051",
//   },
//   {
//     name: "Ferretab 200mg Tablet",
//     ingredient: "Iron Fumarate",
//     category: "Vitamins and Supplements",
//     form: "Tablet",
//     dosage: 200,
//     unit: "mg",
//     barcode: "1000000000052",
//   },
//   {
//     name: "Calcium D3 Nycomed 500mg Tablet",
//     ingredient: "Calcium Carbonate",
//     category: "Vitamins and Supplements",
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000053",
//   },
//   {
//     name: "Flemoxin Solutab 500mg",
//     ingredient: "Amoxicillin",
//     category: "Antibiotics",
//     form: "Capsule",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000001",
//   },
//   {
//     name: "Sumamed 250mg Tablet",
//     ingredient: "Azithromycin",
//     category: "Antibiotics",
//     form: "Tablet",
//     dosage: 250,
//     unit: "mg",
//     barcode: "1000000000002",
//   },
//   {
//     name: "Rocephin 1g Injection",
//     ingredient: "Ceftriaxone",
//     category: "Antibiotics",
//     form: "Injection",
//     dosage: 1,
//     unit: "g",
//     barcode: "1000000000003",
//   },
//   {
//     name: "Zovirax 200mg Tablet",
//     ingredient: "Acyclovir",
//     category: "Antivirals",
//     form: "Tablet",
//     dosage: 200,
//     unit: "mg",
//     barcode: "1000000000004",
//   },
//   {
//     name: "Tamiflu 75mg Capsule",
//     ingredient: "Oseltamivir",
//     category: "Antivirals",
//     form: "Capsule",
//     dosage: 75,
//     unit: "mg",
//     barcode: "1000000000005",
//   },
//   {
//     name: "Diflucan 150mg Capsule",
//     ingredient: "Fluconazole",
//     category: "Antifungals",
//     form: "Capsule",
//     dosage: 150,
//     unit: "mg",
//     barcode: "1000000000006",
//   },
//   {
//     name: "Canesten 1% Cream",
//     ingredient: "Clotrimazole",
//     category: "Antifungals",
//     form: "Cream",
//     dosage: 1,
//     unit: "g",
//     barcode: "1000000000007",
//   },
//   {
//     name: "Panadol 500mg Tablet",
//     ingredient: "Paracetamol",
//     category: "Analgesics",
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000008",
//   },
//   {
//     name: "Nurofen 400mg Tablet",
//     ingredient: "Ibuprofen",
//     category: "Analgesics",
//     form: "Tablet",
//     dosage: 400,
//     unit: "mg",
//     barcode: "1000000000009",
//   },
//   {
//     name: "Voltaren 50mg Tablet",
//     ingredient: "Diclofenac",
//     category: "Anti-inflammatory Drugs",
//     form: "Tablet",
//     dosage: 50,
//     unit: "mg",
//     barcode: "1000000000010",
//   },
//   {
//     name: "Naprosyn 250mg Tablet",
//     ingredient: "Naproxen",
//     category: "Anti-inflammatory Drugs",
//     form: "Tablet",
//     dosage: 250,
//     unit: "mg",
//     barcode: "1000000000011",
//   },
//   {
//     name: "Claritin 10mg Tablet",
//     ingredient: "Loratadine",
//     category: "Antihistamines",
//     form: "Tablet",
//     dosage: 10,
//     unit: "mg",
//     barcode: "1000000000012",
//   },
//   {
//     name: "Zyrtec 10mg Tablet",
//     ingredient: "Cetirizine",
//     category: "Antihistamines",
//     form: "Tablet",
//     dosage: 10,
//     unit: "mg",
//     barcode: "1000000000013",
//   },
//   {
//     name: "Prozac 20mg Capsule",
//     ingredient: "Fluoxetine",
//     category: "Antidepressants",
//     form: "Capsule",
//     dosage: 20,
//     unit: "mg",
//     barcode: "1000000000014",
//   },
//   {
//     name: "Zoloft 50mg Tablet",
//     ingredient: "Sertraline",
//     category: "Antidepressants",
//     form: "Tablet",
//     dosage: 50,
//     unit: "mg",
//     barcode: "1000000000015",
//   },
//   {
//     name: "Norvasc 5mg Tablet",
//     ingredient: "Amlodipine",
//     category: "Cardiovascular Drugs",
//     form: "Tablet",
//     dosage: 5,
//     unit: "mg",
//     barcode: "1000000000016",
//   },
//   {
//     name: "Tenormin 50mg Tablet",
//     ingredient: "Atenolol",
//     category: "Cardiovascular Drugs",
//     form: "Tablet",
//     dosage: 50,
//     unit: "mg",
//     barcode: "1000000000017",
//   },
//   {
//     name: "Glucophage 500mg Tablet",
//     ingredient: "Metformin",
//     category: "Antidiabetic Agents",
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000018",
//   },
//   {
//     name: "Humulin 100 IU Injection",
//     ingredient: "Insulin",
//     category: "Antidiabetic Agents",
//     form: "Injection",
//     dosage: 100,
//     unit: "IU",
//     barcode: "1000000000019",
//   },
//   {
//     name: "Omez 20mg Capsule",
//     ingredient: "Omeprazole",
//     category: "Gastrointestinal Drugs",
//     form: "Capsule",
//     dosage: 20,
//     unit: "mg",
//     barcode: "1000000000020",
//   },
//   {
//     name: "Zantac 150mg Tablet",
//     ingredient: "Ranitidine",
//     category: "Gastrointestinal Drugs",
//     form: "Tablet",
//     dosage: 150,
//     unit: "mg",
//     barcode: "1000000000021",
//   },
//   {
//     name: "Redoxon 500mg Tablet",
//     ingredient: "Vitamin C",
//     category: "Vitamins and Supplements",
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000022",
//   },
//   {
//     name: "Vigantol 1000 IU Capsule",
//     ingredient: "Vitamin D3",
//     category: "Vitamins and Supplements",
//     form: "Capsule",
//     dosage: 1000,
//     unit: "IU",
//     barcode: "1000000000023",
//   },
//   {
//     name: "Panadol 500mg Tablet",
//     ingredient: "Paracetamol",
//     categories: ["Analgesics", "Anti-inflammatory Drugs"],
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000008",
//   },
//   {
//     name: "Nurofen 400mg Tablet",
//     ingredient: "Ibuprofen",
//     categories: ["Analgesics", "Anti-inflammatory Drugs"],
//     form: "Tablet",
//     dosage: 400,
//     unit: "mg",
//     barcode: "1000000000009",
//   },
//   {
//     name: "Aspirin Cardio 100mg Tablet",
//     ingredient: "Aspirin",
//     categories: [
//       "Cardiovascular Drugs",
//       "Analgesics",
//       "Anti-inflammatory Drugs",
//     ],
//     form: "Tablet",
//     dosage: 100,
//     unit: "mg",
//     barcode: "1000000000034",
//   },
//   {
//     name: "Voltaren 50mg Tablet",
//     ingredient: "Diclofenac",
//     categories: ["Anti-inflammatory Drugs", "Analgesics"],
//     form: "Tablet",
//     dosage: 50,
//     unit: "mg",
//     barcode: "1000000000010",
//   },
//   {
//     name: "Movalis 15mg Tablet",
//     ingredient: "Meloxicam",
//     categories: ["Anti-inflammatory Drugs", "Analgesics"],
//     form: "Tablet",
//     dosage: 15,
//     unit: "mg",
//     barcode: "1000000000035",
//   },
//   {
//     name: "Redoxon 500mg Tablet",
//     ingredient: "Vitamin C",
//     categories: ["Vitamins and Supplements", "Immunity Boosters"],
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000022",
//   },
//   {
//     name: "Vigantol 1000 IU Capsule",
//     ingredient: "Vitamin D3",
//     categories: ["Vitamins and Supplements", "Bone Health"],
//     form: "Capsule",
//     dosage: 1000,
//     unit: "IU",
//     barcode: "1000000000023",
//   },
//   {
//     name: "Neurobion B12 Injection 1000mcg",
//     ingredient: "Vitamin B12",
//     categories: ["Vitamins and Supplements", "Neurological Agents"],
//     form: "Injection",
//     dosage: 1000,
//     unit: "mcg",
//     barcode: "1000000000046",
//   },
//   {
//     name: "Zincteral 220mg Tablet",
//     ingredient: "Zinc Sulfate",
//     categories: ["Vitamins and Supplements", "Immunity Boosters"],
//     form: "Tablet",
//     dosage: 220,
//     unit: "mg",
//     barcode: "1000000000050",
//   },
//   {
//     name: "Glucophage 500mg Tablet",
//     ingredient: "Metformin",
//     categories: ["Antidiabetic Agents", "Cardiovascular Drugs"],
//     form: "Tablet",
//     dosage: 500,
//     unit: "mg",
//     barcode: "1000000000018",
//   },
//   {
//     name: "Norvasc 5mg Tablet",
//     ingredient: "Amlodipine",
//     categories: ["Cardiovascular Drugs", "Antihypertensives"],
//     form: "Tablet",
//     dosage: 5,
//     unit: "mg",
//     barcode: "1000000000016",
//   },
//   {
//     name: "Tenormin 50mg Tablet",
//     ingredient: "Atenolol",
//     categories: ["Cardiovascular Drugs", "Antihypertensives"],
//     form: "Tablet",
//     dosage: 50,
//     unit: "mg",
//     barcode: "1000000000017",
//   },
//   {
//     name: "Prozac 20mg Capsule",
//     ingredient: "Fluoxetine",
//     categories: ["Antidepressants", "Sedatives and Hypnotics"],
//     form: "Capsule",
//     dosage: 20,
//     unit: "mg",
//     barcode: "1000000000014",
//   },
//   {
//     name: "Zoloft 50mg Tablet",
//     ingredient: "Sertraline",
//     categories: ["Antidepressants", "Sedatives and Hypnotics"],
//     form: "Tablet",
//     dosage: 50,
//     unit: "mg",
//     barcode: "1000000000015",
//   },
//   {
//     name: "Telfast 120mg Tablet",
//     ingredient: "Fexofenadine",
//     categories: ["Antihistamines", "Respiratory Drugs"],
//     form: "Tablet",
//     dosage: 120,
//     unit: "mg",
//     barcode: "1000000000044",
//   },
//   {
//     name: "Zyrtec 10mg Tablet",
//     ingredient: "Cetirizine",
//     categories: ["Antihistamines", "Respiratory Drugs"],
//     form: "Tablet",
//     dosage: 10,
//     unit: "mg",
//     barcode: "1000000000013",
//   },
//   {
//     name: "Tamiflu 75mg Capsule",
//     ingredient: "Oseltamivir",
//     categories: ["Antivirals", "Respiratory Drugs"],
//     form: "Capsule",
//     dosage: 75,
//     unit: "mg",
//     barcode: "1000000000005",
//   },
//   {
//     name: "Nizoral 2% Shampoo",
//     ingredient: "Ketoconazole",
//     categories: ["Antifungals", "Topical Treatments", "Dermatological Agents"],
//     form: "Solution",
//     dosage: 2,
//     unit: "g",
//     barcode: "1000000000038",
//   },
//   {
//     name: "Lamisil 250mg Tablet",
//     ingredient: "Terbinafine",
//     categories: ["Antifungals", "Topical Treatments"],
//     form: "Tablet",
//     dosage: 250,
//     unit: "mg",
//     barcode: "1000000000039",
//   },
//   {
//     name: "Aspirin Cardio 100mg Tablet",
//     ingredient: "Aspirin",
//     categories: [
//       "Cardiovascular Drugs",
//       "Analgesics",
//       "Anti-inflammatory Drugs",
//     ],
//     form: "Tablet",
//     dosage: 100,
//     unit: "mg",
//     barcode: "1000000000034",
//   },
// ];
