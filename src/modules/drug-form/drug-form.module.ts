import { Module } from "@nestjs/common";
import { DrugFormService } from "./drug-form.service";
import { DrugFormController } from "./drug-form.controller";

@Module({
  controllers: [DrugFormController],
  providers: [DrugFormService],
})
export class DrugFormModule {}
