import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpdateDosageUnitDto } from "./dto/update-dosage-unit.dto";
import { CreateDosageUnitDto } from "./dto/create-dosage-unit.dto";

@Injectable()
export class DosageUnitService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDosageUnitDto: CreateDosageUnitDto) {
    const { name } = createDosageUnitDto;

    await this.findByNameOrThrow(name);

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
    return await this.findByInOrThorw(id);
  }
  async update(id: number, updateDosageUnitDto: UpdateDosageUnitDto) {
    const { name } = updateDosageUnitDto;
    await this.findByNameOrThrow(name);

    const updateDosageUnit = await this.prisma.dosageUnit.update({
      where: { id },
      data: { name },
    });
    return updateDosageUnit;
  }
  private async findByInOrThorw(id: number) {
    const dosageUnit = await this.prisma.dosageUnit.findUnique({
      where: { id },
    });
    if (!dosageUnit) throw new ConflictException("Dosage Unit not found");
    return dosageUnit;
  }
  private async findByNameOrThrow(name: string) {
    const dosageUnit = await this.prisma.dosageUnit.findUnique({
      where: { name },
    });
    if (dosageUnit)
      throw new ConflictException("Dosage Unit is already existed");
    return dosageUnit;
  }
}
