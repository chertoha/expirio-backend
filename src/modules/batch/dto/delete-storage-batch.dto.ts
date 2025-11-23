import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class DeleteStorageBatchDto {
  @IsInt()
  @Type(() => Number)
  batchId: number;

  @IsInt()
  @Type(() => Number)
  storageId: number;
}
