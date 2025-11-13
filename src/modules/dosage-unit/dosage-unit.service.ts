import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpdateDosageUnitDto } from "./dto/update-dosage-unit.dto";
import { CreateDosageUnitDto } from "./dto/create-dosage-unit.dto";

@Injectable()
export class DosageUnitService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDosageUnitDto: CreateDosageUnitDto) {
    const { name } = createDosageUnitDto;

    await this.throwIfNameExists(name);

    const newDosageUnit = await this.prisma.dosageUnit.create({
      data: { name },
    });
    return newDosageUnit;
  }
  async findAll() {
    return this.prisma.dosageUnit.findMany({
      orderBy: { id: "asc" },
    });
  }
  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }
  async update(id: number, updateDosageUnitDto: UpdateDosageUnitDto) {
    const { name } = updateDosageUnitDto;

    await this.findByIdOrThrow(id);
    await this.throwIfNameExists(name);

    const updateDosageUnit = await this.prisma.dosageUnit.update({
      where: { id },
      data: { name },
    });
    return updateDosageUnit;
  }
  async remove(id: number) {
    await this.findByIdOrThrow(id);

    const usedInProducts = await this.prisma.product.findMany({
      where: { dosageUnitId: id },
      select: { id: true, name: true },
    });

    if (usedInProducts.length > 0) {
      throw new ConflictException(
        `Cannot delete active ingredient. It is used in products: ${usedInProducts
          .map(p => p.name)
          .join(", ")}`,
      );
    }
    return await this.prisma.dosageUnit.delete({ where: { id } });
  }
  async findByIdOrThrow(id: number) {
    const dosageUnit = await this.prisma.dosageUnit.findUnique({
      where: { id },
    });
    if (!dosageUnit) throw new ConflictException("Dosage Unit not found");
    return dosageUnit;
  }
  private async throwIfNameExists(name: string) {
    const dosageUnit = await this.prisma.dosageUnit.findUnique({
      where: { name },
    });
    if (dosageUnit)
      throw new ConflictException(
        "Dosage Unit with this name is already existed",
      );
    return dosageUnit;
  }
}
