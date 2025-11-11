import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { CategoryModule } from "../category/category.module";
import { PageableModule } from "../pageable/pageable.module";

@Module({
  imports: [CategoryModule, PageableModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
