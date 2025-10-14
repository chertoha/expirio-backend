import { ConflictException, Injectable } from "@nestjs/common";
import { CreateActiveIngredientDto } from "./dto/create-active-ingredient.dto";
import { UpdateActiveIngredientDto } from "./dto/update-active-ingredient.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ActiveIngredientService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createActiveIngredientDto: CreateActiveIngredientDto) {
    const { name } = createActiveIngredientDto;

    await this.findByNameOrThrow(name);

    const newActiveIngredient = await this.prisma.activeIngredient.create({
      data: { name },
    });
    return newActiveIngredient;
  }

  async findAll() {
    return this.prisma.activeIngredient.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(
    id: number,
    updateActiveIngredientDto: UpdateActiveIngredientDto,
  ) {
    const { name } = updateActiveIngredientDto;
    await this.findByIdOrThrow(id);

    await this.findByNameOrThrow(name!);

    const updatedActiveIngredient = await this.prisma.activeIngredient.update({
      where: { id },
      data: { name },
    });
    return updatedActiveIngredient;
  }

  private async findByIdOrThrow(id: number) {
    const activeIngredient = await this.prisma.activeIngredient.findUnique({
      where: { id },
    });

    if (!activeIngredient)
      throw new ConflictException("Active Ingredient not found");
    return activeIngredient;
  }

  private async findByNameOrThrow(name: string) {
    const activeIngredient = await this.prisma.activeIngredient.findUnique({
      where: { name },
    });
    if (activeIngredient)
      throw new ConflictException("Active Ingredient is already existed");
    return activeIngredient;
  }
  remove(id: number) {
    return `This action removes a #${id} activeIngredient`;
  }
}
