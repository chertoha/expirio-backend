import { IsInt, Min } from "class-validator";

export class RelocateBatchDto {
  @IsInt()
  batchId: number;

  @IsInt()
  currentStorageId: number;

  @IsInt()
  nextStorageId: number;

  @IsInt()
  @Min(1)
  relocatedQty: number;
}
