import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateBatchDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
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

  @IsInt()
  storageId: number;

  @IsInt()
  @Min(0)
  qty: number;
}
