import { ConflictException, Injectable } from "@nestjs/common";
import { CreateBatchDto } from "./dto/create-batch.dto";
import { UpdateBatchDto } from "./dto/update-batch.dto";
import { PrismaService } from "../database/prisma.service";
import { PageableService } from "../pageable/pageable.service";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";

@Injectable()
export class BatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pageableService: PageableService,
  ) {}
  async create(createBatchDto: CreateBatchDto) {
    const {
      batchNumber,
      description,
      manufactureDate,
      expirationDate,
      productId,
    } = createBatchDto;

    await this.findByBatchNumberOrThrow(batchNumber);

    const newBatch = await this.prisma.batch.create({
      data: {
        batchNumber,
        description,
        manufactureDate: new Date(manufactureDate),
        expirationDate: new Date(expirationDate),
        productId,
      },
    });

    return newBatch;
  }

  async findAll(dto: QueryPageOptionsDto) {
    return this.pageableService.findAll(
      "batch",
      dto,
      {},
      {
        storages: true,
        product: { include: { categories: { include: { category: true } } } },
      },
    );
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    const {
      batchNumber,
      description,
      manufactureDate,
      expirationDate,
      productId,
    } = updateBatchDto;
    const existingBatch = await this.findByIdOrThrow(id);
    if (batchNumber && batchNumber !== existingBatch.batchNumber)
      await this.findByBatchNumberOrThrow(batchNumber);

    const updateBatche = await this.prisma.batch.update({
      where: { id },
      data: {
        batchNumber,
        description,
        manufactureDate,
        expirationDate,
        productId,
      },
    });
    return updateBatche;
  }

  async remove(id: number) {
    const batch = await this.prisma.batch.findUnique({ where: { id } });
    if (!batch) return { message: "Batch not found, nothing to delete." };

    const assignedStorages = await this.prisma.storageBatch.findMany({
      where: { batchId: id },
    });

    if (assignedStorages.length > 0) {
      throw new ConflictException(
        `Cannot delete batch. It is assigned to storages: ${assignedStorages
          .map(s => s.storageId)
          .join(", ")}`,
      );
    }

    await this.prisma.batch.delete({ where: { id } });
    return { message: "Batch deleted successfully." };
  }

  private async findByIdOrThrow(id: number) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        storages: true,
        product: { include: { categories: { include: { category: true } } } },
      },
    });
    if (!batch) throw new ConflictException("Batch not found");
    return batch;
  }

  private async findByBatchNumberOrThrow(batchNumber: string) {
    const existing = await this.prisma.batch.findUnique({
      where: { batchNumber },
    });
    if (existing)
      throw new ConflictException(
        "Batch with this batch number already exists",
      );
    return existing;
  }
}
