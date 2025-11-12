import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../database/prisma.service";
import { PageableService } from "../pageable/pageable.service";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pageableService: PageableService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;

    await this.findByNameOrThrow(name);

    const newCategory = await this.prisma.category.create({
      data: { name, description },
    });

    return newCategory;
  }

  // async findAll() {
  //   return this.prisma.category.findMany({
  //     orderBy: { id: "asc" },
  //   });
  // }
  async findAll(dto: QueryPageOptionsDto) {
    const include: Prisma.CategoryInclude = {
      products: true,
    };
    return await this.pageableService.findAll("category", dto, {}, include);
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, description } = updateCategoryDto;
    await this.findByIdOrThrow(id);

    await this.findByNameOrThrow(name, id);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: { name, description },
    });
    return updatedCategory;
  }

  async findByIdOrThrow(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new ConflictException("Category not found");
    return category;
  }

  private async findByNameOrThrow(name: string, selfId?: number) {
    const category = await this.prisma.category.findUnique({
      where: { name, NOT: { id: selfId } },
    });

    if (category) throw new ConflictException("Category is already existed");
    return category;
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);

    const assignedCategories = await this.prisma.productCategory.findMany({
      where: { categoryId: id },
    });
    if (assignedCategories.length > 0)
      throw new ConflictException(
        `Cannot delete category. These products assigned to the category: ${assignedCategories.map(({ productId }) => productId).join(", ")}`,
      );

    return await this.prisma.category.delete({ where: { id } });
  }
}
