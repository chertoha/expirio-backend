-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "days_before" INTEGER NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_channels" (
    "id" SERIAL NOT NULL,
    "type" "AlertType" NOT NULL,
    "alert_id" INTEGER NOT NULL,

    CONSTRAINT "alert_channels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "alert_channels" ADD CONSTRAINT "alert_channels_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
