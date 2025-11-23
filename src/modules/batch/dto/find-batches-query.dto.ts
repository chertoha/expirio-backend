import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional } from "class-validator";
import { TransformBoolean } from "src/decorators/transform-boolean.decorator";
import { QueryPageOptionsDto } from "src/modules/pageable/dto/query-options.dto";
import { BatchStatus } from "src/types/common";

export class FindBatchesQueryDto extends QueryPageOptionsDto {
  @TransformBoolean()
  @IsBoolean()
  @IsOptional()
  expired?: boolean;

  @IsEnum(BatchStatus)
  @IsOptional()
  status?: BatchStatus;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  productId?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  storageId?: number;
}
