import { CreateBatchDto } from "./create-batch.dto";
import { OmitType } from "@nestjs/swagger";

export class UpdateBatchDto extends OmitType(CreateBatchDto, [
  "qty",
  "storageId",
] as const) {}
