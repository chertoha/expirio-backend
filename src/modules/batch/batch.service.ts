import {
  BadRequestException,
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
import { ActiveIngredient, Batch, Prisma, Product } from "@prisma/client";
import { RelocateBatchDto } from "./dto/relocate-batch.dto";
import { WriteOffBatchDto } from "./dto/write-off-batch.dto";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";
import { PageableDto } from "../pageable/dto/pageable.dto";
import { DeleteStorageBatchDto } from "./dto/delete-storage-batch.dto";
import { throwIfEndDateSooner } from "src/helpers/date";
import { BatchStatus } from "src/types/common";
import {
  BATCH_EXPIRING_SOON_PERIOD,
  BATCH_IMPORT_REQUIRED_COLUMNS,
} from "src/config/constants";
import * as XLSX from "xlsx";
import { isDateString } from "class-validator";

type BatchExcelColumn = {
  batchNumber: string;
  product: string;
  barcode: string;
  dosage: number;
  dosageUnit: string;
  activeIngredient: string;
  qty: number;
  manufactureDate: string;
  expirationDate: string;
  storage: string;
  [key: string]: any;
};

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
    throwIfEndDateSooner(new Date(manufactureDate), new Date(expirationDate));

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
    const { search, status, productId, categoryId, storageId } = dto;

    const today = new Date();
    const soon = new Date(today);
    soon.setDate(soon.getDate() + BATCH_EXPIRING_SOON_PERIOD);

    const where: Prisma.BatchWhereInput = {
      isActive: true,

      ...(search && {
        batchNumber: { contains: search, mode: "insensitive" },
      }),

      ...(status === BatchStatus.EXPIRED && {
        expirationDate: { lt: today },
      }),

      ...(status === BatchStatus.EXPIRING_SOON && {
        expirationDate: { gte: today, lte: soon },
      }),

      ...(status === BatchStatus.ACTIVE && {
        expirationDate: { gt: soon },
      }),

      ...(productId && { productId }),

      ...(categoryId && { product: { categories: { some: { categoryId } } } }),

      ...(storageId && { storages: { some: { storageId } } }),
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
    const { productId, batchNumber, manufactureDate, expirationDate } =
      updateBatchDto;

    await this.findByIdOrThrow(id);
    await this.throwIfBatchNumberExists(batchNumber, id);
    await this.productService.findByIdOrThrow(productId);
    throwIfEndDateSooner(new Date(manufactureDate), new Date(expirationDate));

    return this.prisma.batch.update({ where: { id }, data: updateBatchDto });
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);

    await this.prisma.$transaction([
      this.prisma.storageBatch.deleteMany({ where: { batchId: id } }),
      this.prisma.batch.delete({ where: { id } }),
    ]);
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

  async deleteStorageBatch(deleteStorageBatchDto: DeleteStorageBatchDto) {
    const { storageId, batchId } = deleteStorageBatchDto;

    await this.findStorageBatchOrThrow(batchId, storageId);

    const deleted = await this.prisma.storageBatch.delete({
      where: { storageId_batchId: { storageId, batchId } },
    });

    const existing = await this.prisma.storageBatch.findMany({
      where: { batchId },
    });

    if (!existing.length) {
      await this.deactivateBatch(batchId);
    }

    return deleted;
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

  async importFromExcel(file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Excel file is required");

    if (
      !file.originalname.endsWith(".xlsx") &&
      !file.originalname.endsWith(".xls")
    ) {
      throw new BadRequestException("File must be an Excel (.xlsx or .xls)");
    }

    const parseExcel = (buffer: Buffer) =>
      new Promise<{ headers: string[]; rows: BatchExcelColumn[] }>(
        (resolve, reject) => {
          try {
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const headers = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            })[0] as string[];

            const rows = XLSX.utils.sheet_to_json<BatchExcelColumn>(worksheet);

            resolve({ headers, rows });
          } catch (err) {
            reject(new Error(String(err)));
          }
        },
      );

    const { headers, rows } = await parseExcel(file.buffer);

    const allowedHeaders = BATCH_IMPORT_REQUIRED_COLUMNS.every(h =>
      headers.includes(h),
    );
    if (!allowedHeaders) throw new BadRequestException("Wrong headers");

    if (!rows.length) return { message: "No rows found in file" };

    return await this.prisma.$transaction(async t => {
      const resultBatches: Batch[] = [];

      for (const row of rows) {
        const rowBatchNumber = row.batchNumber.trim();
        const rowProduct = row.product.trim();
        const rowBarcode = String(row.barcode).trim();
        const rowDosage = row.dosage;
        const rowDosageUnit = row.dosageUnit.trim();
        const rowActiveIngredient = row.activeIngredient.trim();
        const rowQty = row.qty;
        const rowManufactureDate = row.manufactureDate;
        const rowExpirationDate = row.expirationDate;
        const rowStorage = row.storage.trim();

        if (!isDateString(rowManufactureDate))
          throw new BadRequestException("Wrong manufacturing date format");

        if (!isDateString(rowExpirationDate))
          throw new BadRequestException("Wrong expiration date format");

        throwIfEndDateSooner(
          new Date(rowManufactureDate),
          new Date(rowExpirationDate),
        );

        let activeIngredient: ActiveIngredient | null = null;
        activeIngredient = await t.activeIngredient.findUnique({
          where: { name: rowActiveIngredient },
        });
        if (!activeIngredient) {
          activeIngredient = await t.activeIngredient.create({
            data: { name: rowActiveIngredient },
          });
        }

        const dosageUnit = await t.dosageUnit.findUnique({
          where: { name: rowDosageUnit },
        });
        if (!dosageUnit)
          throw new NotFoundException(
            `Dosage unit '${rowDosageUnit}' not found`,
          );

        let product: Product | null = null;
        product = await t.product.findUnique({ where: { name: rowProduct } });
        if (!product) {
          product = await t.product.create({
            data: {
              name: rowProduct,
              barcode: rowBarcode,
              dosage: rowDosage,
              activeIngredientId: activeIngredient.id,
              dosageUnitId: dosageUnit.id,
            },
          });
        }
        if (rowBarcode !== product.barcode)
          throw new BadRequestException(`Wrong barcode ${rowBarcode}`);

        const storage = await t.storage.findUnique({
          where: { name: rowStorage },
        });
        if (!storage)
          throw new NotFoundException(`Storage '${rowStorage}' not found`);

        let batch = await t.batch.findUnique({
          where: { batchNumber: rowBatchNumber },
        });
        if (batch)
          throw new ConflictException(
            `Batch number ${rowBatchNumber} already exists`,
          );

        batch = await t.batch.create({
          data: {
            batchNumber: rowBatchNumber,
            manufactureDate: new Date(rowManufactureDate),
            expirationDate: new Date(rowExpirationDate),
            product: { connect: { id: product.id } },
            storages: {
              create: {
                storage: { connect: { id: storage.id } },
                qty: rowQty,
              },
            },
          },
        });

        resultBatches.push(batch);
      }

      return resultBatches;
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
    const existing = await this.prisma.batch.findFirst({
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
