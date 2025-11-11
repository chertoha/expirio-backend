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

    await this.findByNameOrThrow(name);

    const newStorage = await this.prisma.storage.create({
      data: { name, description, temperature },
    });
    return newStorage;
  }

  async findAll() {
    return await this.prisma.storage.findMany();
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateStorageDto: UpdateStorageDto) {
    const { name, description, temperature } = updateStorageDto;

    const existingStorage = await this.findByIdOrThrow(id);
    if (name && name !== existingStorage.name) {
      await this.findByNameOrThrow(name);
    }

    const updatedStorage = await this.prisma.storage.update({
      where: { id },
      data: { name, description, temperature },
    });
    return updatedStorage;
  }

  async findByIdOrThrow(id: number) {
    const storage = await this.prisma.storage.findUnique({ where: { id } });
    if (!storage) throw new NotFoundException("Storage not found");
    return storage;
  }

  private async findByNameOrThrow(name: string) {
    const storage = await this.prisma.storage.findUnique({
      where: { name },
    });
    if (storage)
      throw new ConflictException("Storage with this name already exists");
    return storage;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} storage`;
  // }
}
