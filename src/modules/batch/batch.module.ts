import { Module } from "@nestjs/common";
import { BatchService } from "./batch.service";
import { BatchController } from "./batch.controller";
import { PrismaService } from "../database/prisma.service";
import { PageableModule } from "../pageable/pageable.module";
@Module({
  imports: [PageableModule],
  controllers: [BatchController],
  providers: [BatchService, PrismaService],
})
export class BatcheModule {}
