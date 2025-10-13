import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    await this.findByNameOrThrow(name);

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
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    await this.findByIdOrThrow(id);

    await this.findByNameOrThrow(name);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: { name },
    });
    return updatedCategory;
  }

  private async findByIdOrThrow(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new ConflictException("Category not found");
    return category;
  }

  private async findByNameOrThrow(name: string) {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    if (category) throw new ConflictException("Category is already existed");
    return category;
  }
  // async remove(id: number) {
  //   await this.findByIdOrThrow(id);
  //   await this.prisma.category.delete({ where: { id } });

  //   return { message: `Category with id=${id} deleted successfully` };
  // }
}
