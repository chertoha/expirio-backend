import { IsInt } from "class-validator";
import { CreateBatchDto } from "./create-batch.dto";

export class UpdateBatchDto extends CreateBatchDto {
  @IsInt()
  oldStorageId: number;
}
