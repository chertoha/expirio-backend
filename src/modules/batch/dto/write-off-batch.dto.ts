import { IsInt, Min } from "class-validator";

export class WriteOffBatchDto {
  @IsInt()
  batchId: number;

  @IsInt()
  storageId: number;

  @IsInt()
  @Min(1)
  qty: number;
}
