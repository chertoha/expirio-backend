import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { PrismaService } from "../database/prisma.service";
import { PageableModule } from "../pageable/pageable.module";

@Module({
  imports: [PageableModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}
