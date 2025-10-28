import { ConflictException, Injectable } from "@nestjs/common";
import { CreateBatcheDto } from "./dto/create-batche.dto";
import { UpdateBatcheDto } from "./dto/update-batche.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class BatcheService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBatcheDto: CreateBatcheDto) {
    const {
      batchNumber,
      description,
      manufactureDate,
      expirationDate,
      productId,
    } = createBatcheDto;

    await this.findByBatchNumberOrThrow(batchNumber);

    const newBatche = await this.prisma.batch.create({
      data: {
        batchNumber,
        description,
        manufactureDate: new Date(manufactureDate),
        expirationDate: new Date(expirationDate),
        productId,
      },
    });

    return newBatche;
  }

  async findAll() {
    return await this.prisma.batch.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateBatcheDto: UpdateBatcheDto) {
    const { batchNumber, description, manufactureDate, expirationDate } =
      updateBatcheDto;
    const existingStorage = await this.findByIdOrThrow(id);
    if (batchNumber && batchNumber !== existingStorage.batchNumber)
      await this.findByBatchNumberOrThrow(batchNumber);

    const updateBatche = await this.prisma.batch.update({
      where: { id },
      data: { batchNumber, description, manufactureDate, expirationDate },
    });
    return updateBatche;
  }

  private async findByIdOrThrow(id: number) {
    const batche = await this.prisma.batch.findUnique({ where: { id } });
    if (!batche) throw new ConflictException("Batche not found");
    return batche;
  }
  private async findByBatchNumberOrThrow(batchNumber: string) {
    const batche = await this.prisma.batch.findUnique({
      where: { batchNumber },
    });
    if (batche)
      throw new ConflictException(
        "Batche with this batch number already exists",
      );
    return batche;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} batche`;
  // }
}
