import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";
import { BasePageOptionsDto, PageOptionsDto } from "./page-options.dto";
import { sortPattern } from "src/utils/patterns";
import { calculateSkip } from "src/helpers/calculateSkip";

export class QueryOptionsDto {
  @ApiPropertyOptional({ example: "cream", description: "Search query" })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    example: "name:asc",
    description: "Sorting field and direction",
  })
  @IsString()
  @Matches(sortPattern, {
    message:
      "Sort must follow format 'field:order', where order is 'asc' or 'desc'.",
  })
  @IsOptional()
  sort?: string;
}

export class QueryBasePageOptionsDto extends IntersectionType(
  BasePageOptionsDto,
  QueryOptionsDto,
) {}

export class QueryPageOptionsDto extends IntersectionType(
  PageOptionsDto,
  QueryOptionsDto,
) {
  get skip() {
    return calculateSkip(this.page, this.limit);
  }
}
