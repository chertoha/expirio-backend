-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ROOT', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dosage_units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "dosage_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."active_ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "active_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "dosage" DOUBLE PRECISION NOT NULL,
    "dosage_unit_id" INTEGER NOT NULL,
    "active_ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."storages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,

    CONSTRAINT "storages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."batches" (
    "id" SERIAL NOT NULL,
    "batch_number" TEXT NOT NULL,
    "description" TEXT,
    "manufacture_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."storage_batches" (
    "storage_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."drug_forms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "drug_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_categories" (
    "category_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."product_forms" (
    "form_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dosage_units_name_key" ON "public"."dosage_units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "active_ingredients_name_key" ON "public"."active_ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "public"."products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "public"."products"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "storages_name_key" ON "public"."storages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "batches_batch_number_key" ON "public"."batches"("batch_number");

-- CreateIndex
CREATE UNIQUE INDEX "storage_batches_storage_id_batch_id_key" ON "public"."storage_batches"("storage_id", "batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "drug_forms_name_key" ON "public"."drug_forms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_category_id_product_id_key" ON "public"."product_categories"("category_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_forms_form_id_product_id_key" ON "public"."product_forms"("form_id", "product_id");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_dosage_unit_id_fkey" FOREIGN KEY ("dosage_unit_id") REFERENCES "public"."dosage_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_active_ingredient_id_fkey" FOREIGN KEY ("active_ingredient_id") REFERENCES "public"."active_ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."batches" ADD CONSTRAINT "batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."storage_batches" ADD CONSTRAINT "storage_batches_storage_id_fkey" FOREIGN KEY ("storage_id") REFERENCES "public"."storages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."storage_batches" ADD CONSTRAINT "storage_batches_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_forms" ADD CONSTRAINT "product_forms_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."drug_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_forms" ADD CONSTRAINT "product_forms_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
