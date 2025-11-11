import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBatchDto } from "./dto/create-batch.dto";
import { UpdateBatchDto } from "./dto/update-batch.dto";
import { PrismaService } from "../database/prisma.service";
import { ProductService } from "../product/product.service";
import { PageableService } from "../pageable/pageable.service";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";

@Injectable()
export class BatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pageableService: PageableService,
    private readonly productService: ProductService,
  ) {}

  async create(createBatchDto: CreateBatchDto) {
    const {
      batchNumber,
      description,
      manufactureDate,
      expirationDate,
      productId,
      storageId,
      qty,
    } = createBatchDto;

    await this.ThrowsWithoutOrIfBatchNumberExists(batchNumber);
    await this.productService.findByIdOrThrow(productId);

    const batchData: any = {
      batchNumber,
      description,
      manufactureDate: new Date(manufactureDate),
      expirationDate: new Date(expirationDate),
      productId,
    };

    if (storageId && qty !== undefined) {
      batchData.storages = {
        create: {
          storage: { connect: { id: Number(storageId) } },
          qty: Number(qty),
        },
      };
    }

    const newBatch = await this.prisma.batch.create({ data: batchData });

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
      "batchNumber", // searchField
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

    await this.findByIdOrThrow(id);
    if (batchNumber) {
      await this.ThrowsWithoutOrIfBatchNumberExists(batchNumber, id);
    }

    // await this.ThrowsWithoutOrIfBatchNumberExists(batchNumber, id);

    const data: any = {
      batchNumber,
      description,
      productId,
    };

    if (manufactureDate) data.manufactureDate = new Date(manufactureDate);
    if (expirationDate) data.expirationDate = new Date(expirationDate);

    const updatedBatch = await this.prisma.batch.update({
      where: { id },
      data,
    });

    return updatedBatch;
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);

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

    return await this.prisma.batch.delete({ where: { id } });
  }

  private async findByIdOrThrow(id: number) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        storages: true,
        product: { include: { categories: { include: { category: true } } } },
      },
    });
    if (!batch) throw new NotFoundException("Batch not found");
    return batch;
  }

  private async ThrowsWithoutOrIfBatchNumberExists(
    batchNumber: string,
    selfId?: number,
  ) {
    const existing = await this.prisma.batch.findFirst({
      where: selfId
        ? {
            batchNumber,
            NOT: { id: selfId },
          }
        : {
            batchNumber,
          },
    });

    if (existing) {
      throw new ConflictException(
        "Batch with this batch number already exists",
      );
    }
    return existing;
  }
}
