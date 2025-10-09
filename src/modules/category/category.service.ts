import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    if (category) throw new ConflictException("Category is already existed");
    const newCategory = await this.prisma.category.create({
      data: { name },
    });

    return newCategory;
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new ConflictException("Category not found");
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    const category = await this.findByIdOrThrow(id);
    const updatedCategory = await this.prisma.category.update({
      where: { id: category.id },
      data: { name },
    });
    return updatedCategory;
  }

  private async findByIdOrThrow(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new ConflictException("Category not found");
    return category;
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);
    await this.prisma.category.delete({ where: { id } });

    return { message: `Category with id=${id} deleted successfully` };
  }
}
