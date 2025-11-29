// // seed-batches.ts
// import { PrismaClient } from "@prisma/client";

// export async function seedBatches(prisma: PrismaClient) {
//   console.log("🌱 Checking batches...");

//   const count = await prisma.batch.count();
//   if (count > 0) {
//     console.log(`ℹ️ Found ${count} existing batches — skipping seeding.`);
//     return;
//   }

//   const products = await prisma.product.findMany();
//   if (!products.length) {
//     console.error("❌ No products found! Seed products first.");
//     return;
//   }

//   const batchesData: any[] = [];
//   const today = new Date("2025-11-08"); // фиксируем дату для стабильности результатов
//   const currentYear = today.getFullYear();

//   for (let i = 0; i < 100; i++) {
//     const product = products[i % products.length];

//     // Определяем, будет ли партия просрочена
//     const isExpired = Math.random() < 0.25; // 25% партий просрочены

//     let manufactureDate: Date;
//     let expirationDate: Date;

//     if (isExpired) {
//       // Просроченные — истекли от 3 до 12 месяцев назад
//       expirationDate = new Date(today);
//       expirationDate.setMonth(
//         today.getMonth() - (3 + Math.floor(Math.random() * 9)),
//       );

//       manufactureDate = new Date(expirationDate);
//       manufactureDate.setMonth(
//         expirationDate.getMonth() - (12 + Math.floor(Math.random() * 6)),
//       );
//     } else {
//       // Действующие — до конца 2025 года
//       expirationDate = new Date(
//         currentYear,
//         11, // декабрь (месяц 11)
//         Math.floor(Math.random() * 31) + 1, // случайный день декабря
//       );

//       // Производство — за 6–18 месяцев до срока
//       manufactureDate = new Date(expirationDate);
//       manufactureDate.setMonth(
//         expirationDate.getMonth() - (6 + Math.floor(Math.random() * 12)),
//       );
//     }

//     batchesData.push({
//       batchNumber: `BATCH-${(1000 + i).toString()}`,
//       description: `Batch of ${product.name}`,
//       manufactureDate,
//       expirationDate,
//       productId: product.id,
//     });
//   }

//   for (const batch of batchesData) {
//     await prisma.batch.create({ data: batch });
//   }

//   console.log(`✅ Seeded ${batchesData.length} batches.`);
//   console.log(
//     `📅 ${Math.round((batchesData.filter(b => b.expirationDate > today).length / batchesData.length) * 100)}% valid batches`,
//   );
// }

// // seed-batches.ts
// import { PrismaClient } from "@prisma/client";

// export async function seedBatches(prisma: PrismaClient) {
//   console.log("🌱 Checking batches...");

//   const count = await prisma.batch.count();
//   if (count > 0) {
//     console.log(`ℹ️ Found ${count} existing batches — skipping seeding.`);
//     return;
//   }

//   const products = await prisma.product.findMany();
//   if (!products.length) {
//     console.error("❌ No products found! Seed products first.");
//     return;
//   }

//   const batchesData: any[] = [];
//   const today = new Date("2025-12-13"); // дата защиты :)

//   for (let i = 0; i < 200; i++) {
//     const product = products[i % products.length];

//     const rnd = Math.random();

//     let manufactureDate: Date;
//     let expirationDate: Date;

//     // ===== 20% – просроченные =====
//     if (rnd < 0.2) {
//       expirationDate = new Date(today);
//       expirationDate.setMonth(
//         today.getMonth() - (1 + Math.floor(Math.random() * 11)),
//       );

//       manufactureDate = new Date(expirationDate);
//       manufactureDate.setMonth(
//         expirationDate.getMonth() - (6 + Math.floor(Math.random() * 12)),
//       );
//     }

//     // ===== 20% – истекают скоро (0–30 дней) =====
//     else if (rnd < 0.4) {
//       expirationDate = new Date(today);
//       expirationDate.setDate(today.getDate() + Math.floor(Math.random() * 30)); // до 30 дней

//       manufactureDate = new Date(expirationDate);
//       manufactureDate.setMonth(
//         expirationDate.getMonth() - (6 + Math.floor(Math.random() * 12)),
//       );
//     }

//     // ===== 40% – нормальные партии (3–12 месяцев) =====
//     else if (rnd < 0.8) {
//       expirationDate = new Date(today);
//       expirationDate.setMonth(
//         today.getMonth() + (3 + Math.floor(Math.random() * 9)),
//       );

//       manufactureDate = new Date(expirationDate);
//       manufactureDate.setMonth(
//         expirationDate.getMonth() - (6 + Math.floor(Math.random() * 12)),
//       );
//     }

//     // ===== 20% – долгосрочные (1–3 года) =====
//     else {
//       expirationDate = new Date(today);
//       expirationDate.setFullYear(
//         today.getFullYear() + (1 + Math.floor(Math.random() * 3)),
//       );

//       manufactureDate = new Date(expirationDate);
//       manufactureDate.setFullYear(
//         expirationDate.getFullYear() - (1 + Math.floor(Math.random() * 2)),
//       );
//     }

//     batchesData.push({
//       batchNumber: `BATCH-${(1000 + i).toString()}`,
//       description: `Batch of ${product.name}`,
//       manufactureDate,
//       expirationDate,
//       productId: product.id,
//     });
//   }

//   for (const batch of batchesData) {
//     await prisma.batch.create({ data: batch });
//   }

//   const valid = batchesData.filter(b => b.expirationDate > today).length;
//   console.log(`✅ Seeded ${batchesData.length} batches.`);
//   console.log(
//     `📅 Valid batches: ${Math.round((valid / batchesData.length) * 100)}%`,
//   );
// }

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

  const total = 200;
  const batchesData: any[] = [];
  const today = new Date("2025-12-13");

  const expiredCount = Math.floor(total * 0.05);
  const soonCount = Math.floor(total * 0.25);
  const normalCount = Math.floor(total * 0.5);
  const longCount = total - expiredCount - soonCount - normalCount;

  const makeRandom = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));

  const addBatch = (
    productIndex: number,
    manufactureDate: Date,
    expirationDate: Date,
  ) => {
    const product = products[productIndex % products.length];

    batchesData.push({
      batchNumber: `BATCH-${(1000 + batchesData.length).toString()}`,
      description: `Batch of ${product.name}`,
      manufactureDate,
      expirationDate,
      productId: product.id,
    });
  };

  // ========================
  // 1) EXPIRED — guaranteed
  // ========================
  for (let i = 0; i < expiredCount; i++) {
    const expirationDate = new Date(today);
    expirationDate.setMonth(today.getMonth() - makeRandom(1, 12));

    const manufactureDate = new Date(expirationDate);
    manufactureDate.setMonth(expirationDate.getMonth() - makeRandom(6, 18));

    addBatch(i, manufactureDate, expirationDate);
  }

  // ========================
  // 2) EXPIRING SOON (0–30 days) — guaranteed
  // ========================
  for (let i = 0; i < soonCount; i++) {
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + makeRandom(1, 30));

    const manufactureDate = new Date(expirationDate);
    manufactureDate.setMonth(expirationDate.getMonth() - makeRandom(6, 18));

    addBatch(i, manufactureDate, expirationDate);
  }

  // ========================
  // 3) NORMAL (3–12 months)
  // ========================
  for (let i = 0; i < normalCount; i++) {
    const expirationDate = new Date(today);
    expirationDate.setMonth(today.getMonth() + makeRandom(3, 12));

    const manufactureDate = new Date(expirationDate);
    manufactureDate.setMonth(expirationDate.getMonth() - makeRandom(6, 18));

    addBatch(i, manufactureDate, expirationDate);
  }

  // ========================
  // 4) LONG TERM (1–3 years)
  // ========================
  for (let i = 0; i < longCount; i++) {
    const expirationDate = new Date(today);
    expirationDate.setFullYear(today.getFullYear() + makeRandom(1, 3));

    const manufactureDate = new Date(expirationDate);
    manufactureDate.setFullYear(
      expirationDate.getFullYear() - makeRandom(1, 3),
    );

    addBatch(i, manufactureDate, expirationDate);
  }

  // === SHUFFLE batchesData before saving ===
  for (let i = batchesData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [batchesData[i], batchesData[j]] = [batchesData[j], batchesData[i]];
  }

  // Write to database
  for (const batch of batchesData) {
    await prisma.batch.create({ data: batch });
  }

  const valid = batchesData.filter(b => b.expirationDate > today).length;
  const soon = batchesData.filter(
    b =>
      b.expirationDate > today &&
      (b.expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <=
        30,
  );

  console.log(`✅ Seeded ${batchesData.length} batches.`);
  console.log(`⏳ Expiring soon: ${soon.length}`);
  console.log(
    `📅 Valid total: ${Math.round((valid / batchesData.length) * 100)}%`,
  );
}
