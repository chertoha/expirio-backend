import { Type } from "class-transformer";
import {
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  IsInt,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  barcode: string;

  @IsNumber()
  dosage: number;

  @IsInt()
  @Type(() => Number)
  dosageUnitId: number;

  @IsInt()
  @Type(() => Number)
  activeIngredientId: number;
}
