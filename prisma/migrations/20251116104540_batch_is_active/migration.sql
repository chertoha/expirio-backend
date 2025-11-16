-- AlterTable
ALTER TABLE "batches" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
