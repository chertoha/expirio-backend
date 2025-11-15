import { Module } from "@nestjs/common";
import { AlertsService } from "./alerts.service";
import { AlertsController } from "./alerts.controller";
import { NodemailerEmailStrategy } from "./strategies/email.strategy";

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, NodemailerEmailStrategy],
})
export class AlertsModule {}
