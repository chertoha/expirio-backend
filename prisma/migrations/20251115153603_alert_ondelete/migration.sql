-- DropForeignKey
ALTER TABLE "alert_channels" DROP CONSTRAINT "alert_channels_alert_id_fkey";

-- AddForeignKey
ALTER TABLE "alert_channels" ADD CONSTRAINT "alert_channels_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
