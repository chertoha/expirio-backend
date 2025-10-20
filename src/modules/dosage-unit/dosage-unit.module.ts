import { Module } from "@nestjs/common";
import { DosageUnitService } from "./dosage-unit.service";
import { DosageUnitController } from "./dosage-unit.controller";

@Module({
  controllers: [DosageUnitController],
  providers: [DosageUnitService],
})
export class DosageUnitModule {}
