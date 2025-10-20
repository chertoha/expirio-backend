import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";
import { calculateSkip } from "src/helpers/calculateSkip";
import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  MIN_PAGE_LIMIT,
} from "src/helpers/constants";

export class BasePageOptionsDto {
  @ApiPropertyOptional({ description: "Page number", default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    default: DEFAULT_PAGE_LIMIT,
    minimum: MIN_PAGE_LIMIT,
    maximum: MAX_PAGE_LIMIT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(MIN_PAGE_LIMIT)
  @Max(MAX_PAGE_LIMIT)
  @IsOptional()
  readonly limit?: number = DEFAULT_PAGE_LIMIT;

  get skip() {
    return calculateSkip(this.page, this.limit);
  }
}

export class PageOptionsDto extends BasePageOptionsDto {
  @ApiPropertyOptional({
    default: false,
    description: "Return all results (ignore pagination)",
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  all?: boolean = false;
}
