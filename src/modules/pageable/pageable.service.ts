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
  ) {
    const { skip, limit, sort, search } = dto;

    const whereCondition = search
      ? { ...where, name: { contains: search, mode: "insensitive" } }
      : where;

    const orderBy = sort
      ? { [sort.split(":")[0]]: sort.split(":")[1] }
      : { createdAt: "desc" };

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
      options: { ...dto, skip, limit },
    });
  }
}
