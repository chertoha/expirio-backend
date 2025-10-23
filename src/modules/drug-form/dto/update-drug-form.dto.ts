import { PartialType } from "@nestjs/swagger";
import { CreateDrugFormDto } from "./create-drug-form.dto";

export class UpdateDrugFormDto extends PartialType(CreateDrugFormDto) {}
