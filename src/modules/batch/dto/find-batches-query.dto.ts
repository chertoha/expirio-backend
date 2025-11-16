import { IsBoolean, IsOptional } from "class-validator";
import { TransformBoolean } from "src/decorators/transform-boolean.decorator";
import { QueryPageOptionsDto } from "src/modules/pageable/dto/query-options.dto";

export class FindBatchesQueryDto extends QueryPageOptionsDto {
  @TransformBoolean()
  @IsBoolean()
  @IsOptional()
  expired?: boolean;
}
