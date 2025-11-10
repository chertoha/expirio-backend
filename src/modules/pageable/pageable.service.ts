import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { PageableDto } from "./dto/pageable.dto";
import { QueryPageOptionsDto } from "./dto/query-options.dto";

type PageableModels = "batch" | "category" | "product";

@Injectable()
export class PageableService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    model: PageableModels,
    dto: QueryPageOptionsDto,
    where?: object,
    include?: object,
  ) {
    const { skip, limit, sort, search, searchField } = dto;

    const defaultSearchFields: Record<PageableModels, string> = {
      category: "name",
      batch: "batchNumber",
      product: "name",
    };

    const field = dto.searchField || defaultSearchFields[model] || "id";

    const whereCondition = dto.search
      ? { ...where, [field]: { contains: dto.search, mode: "insensitive" } }
      : where;

    const orderBy = sort
      ? { [sort.split(":")[0]]: sort.split(":")[1] }
      : { id: "desc" };

    const prismaModel = this.prisma[model] as any;

    const [data, totalElements] = await Promise.all([
      prismaModel.findMany({
        skip,
        take: limit,
        where: whereCondition,
        orderBy,
        include,
      }),
      prismaModel.count({ where: whereCondition }),
    ]);

    return { data, totalElements, page: dto.page, limit: dto.limit };
  }
}
