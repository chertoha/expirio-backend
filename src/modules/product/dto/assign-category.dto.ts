import { Type } from "class-transformer";
import { IsArray, IsInt } from "class-validator";

export class AssignCategoryDto {
  @IsArray()
  @IsInt({ each: true })
  productIds: number[];

  @IsInt()
  @Type(() => Number)
  categoryId: number;
}
