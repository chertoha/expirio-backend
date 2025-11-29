// // seed-storage-batches.ts
// import { PrismaClient } from "@prisma/client";

// export async function seedStorageBatches(prisma: PrismaClient) {
//   console.log("🌱 Checking storage batches...");

//   const count = await prisma.storageBatch.count();
//   if (count > 0) {
//     console.log(
//       `ℹ️ Found ${count} existing storage-batch links — skipping seeding.`,
//     );
//     return;
//   }

//   const storages = await prisma.storage.findMany();
//   const batches = await prisma.batch.findMany({
//     include: {
//       product: { include: { categories: { include: { category: true } } } },
//     },
//   });

//   if (!storages.length || !batches.length) {
//     console.error("❌ Missing storages or batches. Seed them first.");
//     return;
//   }

//   const storageBatchesData: any[] = [];

//   for (const batch of batches) {
//     const categoryName =
//       batch.product.categories[0]?.category.name ?? "General";
//     let storage: any = null;

//     if (categoryName.includes("Antibiotic"))
//       storage = storages.find(s => s.name.includes("Antibiotic"));
//     else if (
//       categoryName.includes("Analgesic") ||
//       categoryName.includes("Anti-inflammatory")
//     )
//       storage = storages.find(s => s.name.includes("Painkiller"));
//     else if (categoryName.includes("Vitamin"))
//       storage = storages.find(s => s.name.includes("Vitamin"));
//     else if (categoryName.includes("Antidiabetic"))
//       storage = storages.find(s => s.name.includes("Diabetic"));
//     else if (categoryName.includes("Antiviral"))
//       storage = storages.find(s => s.name.includes("Prescription"));
//     else if (categoryName.includes("Antifungal"))
//       storage = storages.find(s => s.name.includes("Topical"));
//     else
//       storage =
//         storages.find(s => s.name.includes("Main Display")) ?? storages[0];

//     const qty = 10 + Math.floor(Math.random() * 90);
//     storageBatchesData.push({
//       storageId: storage.id,
//       batchId: batch.id,
//       qty,
//     });
//   }

//   await prisma.storageBatch.createMany({ data: storageBatchesData });
//   console.log(`✅ Seeded ${storageBatchesData.length} storage-batch links.`);
// }

// seed-storage-batches.ts
import { PrismaClient } from "@prisma/client";

export async function seedStorageBatches(prisma: PrismaClient) {
  console.log("🌱 Checking storage batches...");

  const count = await prisma.storageBatch.count();
  if (count > 0) {
    console.log(
      `ℹ️ Found ${count} existing storage-batch links — skipping seeding.`,
    );
    return;
  }

  const storages = await prisma.storage.findMany();
  const batches = await prisma.batch.findMany({
    include: {
      product: { include: { categories: { include: { category: true } } } },
    },
  });

  if (!storages.length || !batches.length) {
    console.error("❌ Missing storages or batches. Seed them first.");
    return;
  }

  const storageBatchesData: any[] = [];

  // ==========================================================
  // 1) Заполняем КАЖДЫЙ склад небольшим количеством батчей
  // ==========================================================

  console.log("📦 Ensuring all storages receive initial batches...");

  for (const storage of storages) {
    // 3–6 батчей на склад
    const pickCount = 3 + Math.floor(Math.random() * 4);

    const picked = batches.sort(() => Math.random() - 0.5).slice(0, pickCount);

    for (const batch of picked) {
      const qty = 5 + Math.floor(Math.random() * 40);
      storageBatchesData.push({
        storageId: storage.id,
        batchId: batch.id,
        qty,
      });
    }
  }

  // ==========================================================
  // 2) Основная логика: распределяем остальные батчи по категориям
  // ==========================================================

  console.log("📦 Distributing batches by category into storages...");

  for (const batch of batches) {
    const categoryName =
      batch.product.categories[0]?.category.name ?? "General";

    let storage: any = null;

    if (categoryName.includes("Antibiotic"))
      storage = storages.find(s => s.name.includes("Antibiotic"));
    else if (
      categoryName.includes("Analgesic") ||
      categoryName.includes("Anti-inflammatory")
    )
      storage = storages.find(s => s.name.includes("Painkiller"));
    else if (categoryName.includes("Vitamin"))
      storage = storages.find(s => s.name.includes("Vitamin"));
    else if (categoryName.includes("Antidiabetic"))
      storage = storages.find(s => s.name.includes("Diabetic"));
    else if (categoryName.includes("Antiviral"))
      storage = storages.find(s => s.name.includes("Prescription"));
    else if (categoryName.includes("Antifungal"))
      storage = storages.find(s => s.name.includes("Topical"));
    else
      storage =
        storages.find(s => s.name.includes("Main Display")) ?? storages[0];

    const qty = 10 + Math.floor(Math.random() * 90);
    storageBatchesData.push({
      storageId: storage.id,
      batchId: batch.id,
      qty,
    });
  }

  // ==========================================================
  // 3) Дополнительный шаг: равномерное распределение (опционально)
  // ==========================================================

  console.log("📊 Adding extra random batches to keep storages balanced...");

  const extraLinks = Math.floor(batches.length * 0.4); // +40% связей

  for (let i = 0; i < extraLinks; i++) {
    const batch = batches[Math.floor(Math.random() * batches.length)];
    const storage = storages[Math.floor(Math.random() * storages.length)];
    const qty = 5 + Math.floor(Math.random() * 50);

    storageBatchesData.push({
      storageId: storage.id,
      batchId: batch.id,
      qty,
    });
  }

  // ==========================================================
  // 4) Создаем в базе
  // ==========================================================

  // Удаляем дубликаты перед createMany
  const uniqueData = Array.from(
    new Map(
      storageBatchesData.map(item => [
        `${item.storageId}-${item.batchId}`,
        item,
      ]),
    ).values(),
  );

  console.log(
    `🧹 Filtered duplicates: ${storageBatchesData.length - uniqueData.length} removed`,
  );
  console.log(`📦 Final records to insert: ${uniqueData.length}`);

  await prisma.storageBatch.createMany({ data: uniqueData });

  console.log(`✅ Seeded ${storageBatchesData.length} storage-batch links.`);
}
