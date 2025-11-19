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
import { RelocateBatchDto } from "./dto/relocate-batch.dto";
import { WriteOffBatchDto } from "./dto/write-off-batch.dto";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";
import { PageableDto } from "../pageable/dto/pageable.dto";

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
      isActive: true,
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

  async findStorageBatches(dto: QueryPageOptionsDto) {
    const where: Prisma.StorageBatchWhereInput = {};
    const storageBatchInclude: Prisma.StorageBatchInclude = {
      batch: {
        include: {
          product: { include: { categories: { include: { category: true } } } },
          storages: {
            include: { storage: true },
          },
        },
      },
      storage: true,
    };

    const page = Number(dto.page) || 1;
    const limit = Number(dto.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, totalElements] = await Promise.all([
      this.prisma.storageBatch.findMany({
        skip,
        take: limit,
        where,
        // orderBy,
        include: storageBatchInclude,
      }),
      this.prisma.storageBatch.count({ where }),
    ]);

    return new PageableDto(data, {
      totalElements,
      options: { ...dto, page, limit, skip },
    });
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
    await this.throwIfHasAssignedStorages(id);
    return await this.prisma.batch.delete({ where: { id } });
  }

  async relocate(relocateBatchDto: RelocateBatchDto) {
    const { batchId, currentStorageId, nextStorageId, relocatedQty } =
      relocateBatchDto;

    const currentStorageBatch = await this.findStorageBatchOrThrow(
      batchId,
      currentStorageId,
    );

    await this.storageService.findByIdOrThrow(nextStorageId);

    if (currentStorageId === nextStorageId) {
      throw new ConflictException("Cannot relocate batch to the same storage");
    }

    if (relocatedQty > currentStorageBatch.qty)
      throw new ConflictException(
        "Quantity for relocation cannot be more than total batch quantity",
      );

    const balance = currentStorageBatch.qty - relocatedQty;

    return await this.prisma.$transaction(async t => {
      let prev = {};

      const next = await this.updateOrCreateStorageBatch(
        nextStorageId,
        batchId,
        relocatedQty,
        t,
      );

      if (balance === 0) {
        await t.storageBatch.delete({
          where: {
            storageId_batchId: { storageId: currentStorageId, batchId },
          },
        });
      } else {
        prev = await t.storageBatch.update({
          where: {
            storageId_batchId: { storageId: currentStorageId, batchId },
          },
          data: { qty: balance },
        });
      }

      return { prev, next };
    });
  }

  async writeOff(writeOffBatchDto: WriteOffBatchDto) {
    const { storageId, batchId, qty } = writeOffBatchDto;

    const currentStorageBatch = await this.findStorageBatchOrThrow(
      batchId,
      storageId,
    );

    if (qty > currentStorageBatch.qty)
      throw new ConflictException(
        "Quantity for write off cannot be more than total batch quantity",
      );

    const balance = currentStorageBatch.qty - qty;

    if (balance === 0) {
      await this.prisma.storageBatch.delete({
        where: { storageId_batchId: { storageId, batchId } },
      });
      await this.deactivateBatch(batchId);
      return {};
    }

    return await this.prisma.storageBatch.update({
      where: { storageId_batchId: { storageId, batchId } },
      data: { qty: balance },
    });
  }

  async deactivateBatch(id: number) {
    await this.findByIdOrThrow(id);
    await this.throwIfHasAssignedStorages(id);

    return await this.prisma.batch.update({
      where: { id },
      data: { isActive: false, deactivatedAt: new Date() },
    });
  }

  private async updateOrCreateStorageBatch(
    storageId: number,
    batchId: number,
    qty: number,
    t?: Prisma.TransactionClient,
  ) {
    const prisma = t ? t : this.prisma;

    const existing = await prisma.storageBatch.findUnique({
      where: { storageId_batchId: { storageId, batchId } },
    });

    if (existing) {
      return await prisma.storageBatch.update({
        where: { storageId_batchId: { storageId, batchId } },
        data: { qty: existing.qty + qty },
      });
    }

    return await prisma.storageBatch.create({
      data: { storageId, batchId, qty },
    });
  }

  async throwIfHasAssignedStorages(batchId: number): Promise<void> {
    const assignedCount = await this.prisma.storageBatch.count({
      where: { batchId },
    });
    if (assignedCount > 0) {
      throw new ConflictException(
        "Cannot deactivate batch. It is still assigned to storages",
      );
    }
  }

  // private async findOrCreateStorageBatch(batchId: number, storageId: number) {
  //   const existing = await this.prisma.storageBatch.findUnique({
  //     where: { storageId_batchId: { batchId, storageId } },
  //   });

  //   if (existing) return existing;

  //   return await this.prisma.storageBatch.create({})
  // }

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

    return existing;
  }
}
