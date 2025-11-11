import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class FindAssignCategoryQueryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  productId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;
}
