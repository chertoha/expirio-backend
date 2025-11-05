import { Module } from "@nestjs/common";
import { BatcheService } from "./batche.service";
import { BatcheController } from "./batche.controller";

@Module({
  controllers: [BatcheController],
  providers: [BatcheService],
})
export class BatcheModule {}
