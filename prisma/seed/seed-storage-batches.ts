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

  await prisma.storageBatch.createMany({ data: storageBatchesData });
  console.log(`✅ Seeded ${storageBatchesData.length} storage-batch links.`);
}
