import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  // Delete,
  Query,
  Put,
  ParseIntPipe,
  Delete,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
// import { PaginationDto } from "../pageable/dto/pagination.dto";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";
// import { FindCategoryDto } from "./dto/find-category.dto";
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  // @Get()
  // findAll() {
  //   return this.categoryService.findAll();
  // }
  // @Get()
  // async getAll(@Query() pagination: PaginationDto) {
  //   return this.categoryService.findAll(pagination);
  // }
  @Get()
  async findAll(@Query() query: QueryPageOptionsDto) {
    return this.categoryService.findAll(query);
  }
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.categoryService.remove(id);
  }
}
