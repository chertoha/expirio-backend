import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { PageOptionsDto } from "./page-options.dto";
import { DEFAULT_PAGE_LIMIT } from "src/helpers/constants";

interface PageableOptions {
  options: PageOptionsDto;
  totalElements: number;
}

export class PageableDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ default: 1 })
  readonly page: number;

  @ApiProperty({ default: DEFAULT_PAGE_LIMIT })
  readonly limit: number;

  @ApiProperty({ default: 1000 })
  readonly totalElements: number;

  constructor(
    data: T[],
    {
      totalElements,
      options: { page = 1, limit = DEFAULT_PAGE_LIMIT },
    }: PageableOptions,
  ) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.totalElements = totalElements;
  }
}
