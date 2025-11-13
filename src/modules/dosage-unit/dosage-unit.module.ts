import { Module } from "@nestjs/common";
import { DosageUnitService } from "./dosage-unit.service";
import { DosageUnitController } from "./dosage-unit.controller";
import { PrismaService } from "../database/prisma.service";

@Module({
  controllers: [DosageUnitController],
  providers: [DosageUnitService, PrismaService],
  exports: [DosageUnitService],
})
export class DosageUnitModule {}
