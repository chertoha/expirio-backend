import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { CategoryModule } from "../category/category.module";
import { PageableModule } from "../pageable/pageable.module";
import { DosageUnitService } from "../dosage-unit/dosage-unit.service";
import { ActiveIngredientService } from "../active-ingredient/active-ingredient.service";

@Module({
  imports: [CategoryModule, PageableModule],
  controllers: [ProductController],
  providers: [ProductService, DosageUnitService, ActiveIngredientService],
  exports: [ProductService],
})
export class ProductModule {}
