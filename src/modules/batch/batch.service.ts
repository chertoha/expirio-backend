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
import { StoragesService } from "../storages/storages.service";
import { FindBatchesQueryDto } from "./dto/find-batches-query.dto";
import { Prisma } from "@prisma/client";

const include = {
  product: { include: { categories: { include: { category: true } } } },
  storages: { include: { storage: true } },
};

@Injectable()
export class BatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pageableService: PageableService,
    private readonly productService: ProductService,
    private readonly storageService: StoragesService,
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

    await this.throwIfBatchNumberExists(batchNumber);
    await this.productService.findByIdOrThrow(productId);
    await this.storageService.findByIdOrThrow(storageId);

    return await this.prisma.batch.create({
      data: {
        batchNumber,
        description,
        manufactureDate: new Date(manufactureDate),
        expirationDate: new Date(expirationDate),
        productId,
        storages: {
          create: {
            storage: { connect: { id: storageId } },
            qty: qty,
          },
        },
      },
      include,
    });
  }

  async findAll(dto: FindBatchesQueryDto) {
    const { expired } = dto;

    const where: Prisma.BatchWhereInput = {
      ...(expired === true && {
        expirationDate: { lte: new Date() },
      }),
    };

    return this.pageableService.findAll(
      "batch",
      dto,
      where,
      include,
      "batchNumber",
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
      qty,
      oldStorageId,
      storageId,
    } = updateBatchDto;

    await this.findByIdOrThrow(id);
    await this.throwIfBatchNumberExists(batchNumber, id);
    await this.productService.findByIdOrThrow(productId);
    await this.storageService.findByIdOrThrow(storageId);
    await this.storageService.findByIdOrThrow(oldStorageId);
    await this.findStorageBatchOrThrow(id, oldStorageId);
    await this.throwIfStorageBatchExists(id, storageId);

    return await this.prisma.$transaction(async t => {
      await t.storageBatch.delete({
        where: { storageId_batchId: { batchId: id, storageId: oldStorageId } },
      });

      return await t.batch.update({
        where: { id },
        data: {
          batchNumber,
          description,
          manufactureDate: new Date(manufactureDate),
          expirationDate: new Date(expirationDate),

          product: { connect: { id: productId } },

          storages: {
            create: {
              storage: { connect: { id: storageId } },
              qty: qty,
            },
          },
        },
        include,
      });
    });
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

  private async throwIfBatchNumberExists(batchNumber: string, selfId?: number) {
    // const existing = await this.prisma.batch.findFirst({
    //   where: selfId
    //     ? {
    //         batchNumber,
    //         NOT: { id: selfId },
    //       }
    //     : {
    //         batchNumber,
    //       },
    // });

    const existing = await this.prisma.batch.findUnique({
      where: { batchNumber, NOT: { id: selfId } },
    });

    if (existing) {
      throw new ConflictException(
        "Batch with this batch number already exists",
      );
    }
  }

  async throwIfStorageBatchExists(batchId: number, storageId: number) {
    const existing = await this.prisma.storageBatch.findUnique({
      where: { storageId_batchId: { batchId, storageId } },
    });

    if (existing) {
      throw new ConflictException("Current batch and storage already exist");
    }
  }

  async findStorageBatchOrThrow(batchId: number, storageId: number) {
    const existing = await this.prisma.storageBatch.findUnique({
      where: { storageId_batchId: { batchId, storageId } },
    });

    if (!existing) throw new NotFoundException("Batch Storage not found");
  }
}
