import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { PageableDto } from "./dto/pageable.dto";
import { QueryPageOptionsDto } from "./dto/query-options.dto";

@Injectable()
export class PageableService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    model: keyof PrismaService,
    dto: QueryPageOptionsDto,
    where?: object,
    include?: object,
    searchField: string = "name",
  ) {
    const page = Number(dto.page) || 1;
    const limit = Number(dto.limit) || 10;
    const skip = (page - 1) * limit;
    const { sort, search } = dto;

    const whereCondition = search
      ? { ...where, [searchField]: { contains: search, mode: "insensitive" } }
      : where;

    const orderBy = sort
      ? (() => {
          const [field, dir] = sort.split(":");
          return { [field]: dir === "asc" ? "asc" : "desc" };
        })()
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

    return new PageableDto(data, {
      totalElements,
      options: { ...dto, page, limit, skip },
    });
  }
}
