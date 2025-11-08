import { PrismaClient } from "@prisma/client";

export async function clearDatabase(prisma: PrismaClient) {
  console.log("🧹 Clearing database...");

  await prisma.$transaction([
    prisma.storageBatch.deleteMany(), // связь many-to-many (storage_batches)
    prisma.batch.deleteMany(), // batches
    prisma.storage.deleteMany(), // storages
    prisma.productForm.deleteMany(), // product_forms (m2m)
    prisma.productCategory.deleteMany(), // product_categories (m2m)
    prisma.product.deleteMany(), // products
    prisma.activeIngredient.deleteMany(), // active_ingredients
    prisma.dosageUnit.deleteMany(), // dosage_units
    prisma.category.deleteMany(), // categories
    prisma.drugForm.deleteMany(), // drug_forms
  ]);

  console.log("✅ Database cleared successfully!");
}
