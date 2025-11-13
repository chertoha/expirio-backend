import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateStorageDto } from "./dto/create-storage.dto";
import { UpdateStorageDto } from "./dto/update-storage.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class StoragesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createStorageDto: CreateStorageDto) {
    const { name, description, temperature } = createStorageDto;

    await this.throwIfStorageNameExists(name);

    return await this.prisma.storage.create({
      data: { name, description, temperature },
    });
  }

  async findAll() {
    const storages = await this.prisma.storage.findMany({
      include: { batches: true },
    });

    return storages;
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateStorageDto: UpdateStorageDto) {
    const { name, description, temperature } = updateStorageDto;

    const existingStorage = await this.findByIdOrThrow(id);
    if (name && name !== existingStorage.name) {
      await this.throwIfStorageNameExists(name);
    }

    return await this.prisma.storage.update({
      where: { id },
      data: { name, description, temperature },
    });
  }
  async remove(id: number) {
    await this.findByIdOrThrow(id);
    const assignedBatches = await this.prisma.storageBatch.findMany({
      where: { storageId: id },
    });

    if (assignedBatches.length > 0) {
      throw new ConflictException(
        `Cannot delete storage. It is assigned to batches: ${assignedBatches
          .map(b => b.batchId)
          .join(", ")}`,
      );
    }
    return await this.prisma.storage.delete({ where: { id } });
  }

  async findByIdOrThrow(id: number) {
    const storage = await this.prisma.storage.findUnique({ where: { id } });
    if (!storage) throw new NotFoundException("Storage not found");
    return storage;
  }

  async throwIfStorageNameExists(name: string) {
    const storage = await this.prisma.storage.findUnique({ where: { name } });
    if (storage) throw new NotFoundException("Storage not found");
    return storage;
  }
}
