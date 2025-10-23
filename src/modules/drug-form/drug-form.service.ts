import { ConflictException, Injectable } from "@nestjs/common";
import { CreateDrugFormDto } from "./dto/create-drug-form.dto";
import { UpdateDrugFormDto } from "./dto/update-drug-form.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class DrugFormService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDrugFormDto: CreateDrugFormDto) {
    const { name } = createDrugFormDto;

    await this.findByNameOrThrow(name);

    const newDrugForm = await this.prisma.drugForm.create({
      data: { name },
    });

    return newDrugForm;
  }

  async findAll() {
    return await this.prisma.drugForm.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateDrugFormDto: UpdateDrugFormDto) {
    const { name } = updateDrugFormDto;

    await this.findByIdOrThrow(id);

    if (name) {
      await this.findByNameOrThrow(name);
    }

    const updateDrugForm = await this.prisma.drugForm.update({
      where: { id },
      data: { name },
    });
    return updateDrugForm;
  }

  private async findByIdOrThrow(id: number) {
    const drungForm = await this.prisma.drugForm.findUnique({ where: { id } });
    if (!drungForm) throw new ConflictException("Drug form not found");
    return drungForm;
  }

  private async findByNameOrThrow(name: string) {
    const drungForm = await this.prisma.drugForm.findUnique({
      where: { name },
    });

    if (drungForm)
      throw new ConflictException("Drug form with this name already exists");
    return drungForm;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} drugForm`;
  // }
}
