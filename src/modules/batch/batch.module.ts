import { Module } from "@nestjs/common";
import { BatchService } from "./batch.service";
import { BatchController } from "./batch.controller";
import { PrismaService } from "../database/prisma.service";
import { PageableService } from "../pageable/pageable.service";
import { ProductModule } from "../product/product.module";
import { StoragesModule } from "../storages/storages.module";
@Module({
  imports: [ProductModule, StoragesModule],
  controllers: [BatchController],
  providers: [BatchService, PrismaService, PageableService],
  exports: [BatchService],
})
export class BatchModule {}
