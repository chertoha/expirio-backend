import {
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  IsInt,
} from "class-validator";
// import { Type } from "class-transformer";

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  barcode: string;

  @IsNumber()
  dosage: number;

  //   @Type(() => Number)
  @IsInt()
  dosageUnitId: number;

  //   @Type(() => Number)
  @IsInt()
  activeIngredientId: number;
}
