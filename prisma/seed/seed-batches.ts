// seed-batches.ts
import { PrismaClient } from "@prisma/client";

export async function seedBatches(prisma: PrismaClient) {
  console.log("🌱 Checking batches...");

  const count = await prisma.batch.count();
  if (count > 0) {
    console.log(`ℹ️ Found ${count} existing batches — skipping seeding.`);
    return;
  }

  const products = await prisma.product.findMany();
  if (!products.length) {
    console.error("❌ No products found! Seed products first.");
    return;
  }

  const batchesData: any[] = [];
  const today = new Date("2025-11-08"); // фиксируем дату для стабильности результатов
  const currentYear = today.getFullYear();

  for (let i = 0; i < 50; i++) {
    const product = products[i % products.length];

    // Определяем, будет ли партия просрочена
    const isExpired = Math.random() < 0.25; // 25% партий просрочены

    let manufactureDate: Date;
    let expirationDate: Date;

    if (isExpired) {
      // Просроченные — истекли от 3 до 12 месяцев назад
      expirationDate = new Date(today);
      expirationDate.setMonth(
        today.getMonth() - (3 + Math.floor(Math.random() * 9)),
      );

      manufactureDate = new Date(expirationDate);
      manufactureDate.setMonth(
        expirationDate.getMonth() - (12 + Math.floor(Math.random() * 6)),
      );
    } else {
      // Действующие — до конца 2025 года
      expirationDate = new Date(
        currentYear,
        11, // декабрь (месяц 11)
        Math.floor(Math.random() * 31) + 1, // случайный день декабря
      );

      // Производство — за 6–18 месяцев до срока
      manufactureDate = new Date(expirationDate);
      manufactureDate.setMonth(
        expirationDate.getMonth() - (6 + Math.floor(Math.random() * 12)),
      );
    }

    batchesData.push({
      batchNumber: `BATCH-${(1000 + i).toString()}`,
      description: `Batch of ${product.name}`,
      manufactureDate,
      expirationDate,
      productId: product.id,
    });
  }

  for (const batch of batchesData) {
    await prisma.batch.create({ data: batch });
  }

  console.log(`✅ Seeded ${batchesData.length} batches.`);
  console.log(
    `📅 ${Math.round((batchesData.filter(b => b.expirationDate > today).length / batchesData.length) * 100)}% valid batches`,
  );
}
