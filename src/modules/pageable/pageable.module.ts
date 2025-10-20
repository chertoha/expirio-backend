import { Module } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { PageableService } from "./pageable.service";

@Module({
  providers: [PrismaService, PageableService],
  exports: [PageableService],
})
export class PageableModule {}
