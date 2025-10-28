import { IsString, IsOptional, IsInt, IsDateString } from "class-validator";

export class CreateBatcheDto {
  @IsString()
  batchNumber: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  manufactureDate: string;

  @IsDateString()
  expirationDate: string;

  @IsInt()
  productId: number;
}
