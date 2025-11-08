import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  ParseIntPipe,
  Query,
  Delete,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AssignCategoryDto } from "./dto/assign-category.dto";
import { FindAssignCategoryQueryDto } from "./dto/find-assign-category-query.dto";
import { DeleteAssignedCategoryDto } from "./dto/delete-assigned-category.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get("assign-category")
  async findAssignedCategory(@Query() queryDto: FindAssignCategoryQueryDto) {
    return await this.productService.findAssignedCategories(queryDto);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.productService.remove(+id);
  // }

  @Post("assign-category")
  async assignCategory(@Body() assignDto: AssignCategoryDto) {
    return await this.productService.assignCategory(assignDto);
  }

  @Delete("assign-category")
  async deleteAssignedCategory(
    @Body() deleteAssignedCategoryDto: DeleteAssignedCategoryDto,
  ) {
    return await this.productService.deleteAssignedCategory(
      deleteAssignedCategoryDto,
    );
  }
}
