import { Module } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { AlertController } from "./alert.controller";
import { NodemailerEmailStrategy } from "./strategies/email.strategy";

@Module({
  controllers: [AlertController],
  providers: [AlertService, NodemailerEmailStrategy],
})
export class AlertsModule {}
