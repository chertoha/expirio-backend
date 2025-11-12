import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
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
import { FindProductQueryDto } from "./dto/find-product-query.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() queryDto: FindProductQueryDto) {
    return await this.productService.findAll(queryDto);
  }

  @Post("assign-category")
  async assignCategory(@Body() assignDto: AssignCategoryDto) {
    return await this.productService.assignCategory(assignDto);
  }

  @Get("assign-category")
  async findAssignedCategory(@Query() queryDto: FindAssignCategoryQueryDto) {
    return await this.productService.findAssignedCategories(queryDto);
  }

  @Delete("assign-category")
  async deleteAssignedCategory(
    @Body() deleteAssignedCategoryDto: DeleteAssignedCategoryDto,
  ) {
    return await this.productService.deleteAssignedCategory(
      deleteAssignedCategoryDto,
    );
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.productService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.productService.delete(id);
  }
}
