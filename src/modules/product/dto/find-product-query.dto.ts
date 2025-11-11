import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { QueryPageOptionsDto } from "src/modules/pageable/dto/query-options.dto";

export class FindProductQueryDto extends QueryPageOptionsDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  activeIngredientId?: number;

  //   get skip() {
  //     return super.;
  //   }
}
