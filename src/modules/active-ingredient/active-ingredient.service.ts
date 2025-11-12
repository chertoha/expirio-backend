import { ConflictException, Injectable } from "@nestjs/common";
import { CreateActiveIngredientDto } from "./dto/create-active-ingredient.dto";
import { UpdateActiveIngredientDto } from "./dto/update-active-ingredient.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ActiveIngredientService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createActiveIngredientDto: CreateActiveIngredientDto) {
    const { name } = createActiveIngredientDto;

    await this.throwIfNameExists(name);

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

    await this.throwIfNameExists(name!);

    const updatedActiveIngredient = await this.prisma.activeIngredient.update({
      where: { id },
      data: { name },
    });
    return updatedActiveIngredient;
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);

    const usedInProducts = await this.prisma.product.findMany({
      where: { activeIngredientId: id },
      select: { id: true, name: true },
    });

    if (usedInProducts.length > 0) {
      throw new ConflictException(
        `Cannot delete active ingredient. It is used in products: ${usedInProducts
          .map(p => p.name)
          .join(", ")}`,
      );
    }

    return this.prisma.activeIngredient.delete({ where: { id } });
  }

  async findByIdOrThrow(id: number) {
    const activeIngredient = await this.prisma.activeIngredient.findUnique({
      where: { id },
    });

    if (!activeIngredient)
      throw new ConflictException("Active Ingredient not found");
    return activeIngredient;
  }

  private async throwIfNameExists(name: string) {
    const existing = await this.prisma.activeIngredient.findUnique({
      where: { name },
    });
    if (existing)
      throw new ConflictException(
        "Active ingredient with this name already exists",
      );
  }
}
