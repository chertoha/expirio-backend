import { PartialType } from "@nestjs/swagger";
import { CreateBatcheDto } from "./create-batche.dto";

export class UpdateBatcheDto extends PartialType(CreateBatcheDto) {}
