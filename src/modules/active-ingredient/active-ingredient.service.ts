import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { CreateActiveIngredientDto } from "./dto/create-active-ingredient.dto";
import { UpdateActiveIngredientDto } from "./dto/update-active-ingredient.dto";
import { PrismaService } from "../database/prisma.service";
import * as XLSX from "xlsx";

@Injectable()
export class ActiveIngredientService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createActiveIngredientDto: CreateActiveIngredientDto) {
    const { name } = createActiveIngredientDto;

    await this.throwIfNameExists(name);

    const newActiveIngredient = await this.prisma.activeIngredient.create({
      data: { name },
    });
    return newActiveIngredient;
  }

  async findAll() {
    return this.prisma.activeIngredient.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(
    id: number,
    updateActiveIngredientDto: UpdateActiveIngredientDto,
  ) {
    const { name } = updateActiveIngredientDto;
    await this.findByIdOrThrow(id);

    await this.throwIfNameExists(name!);

    const updatedActiveIngredient = await this.prisma.activeIngredient.update({
      where: { id },
      data: { name },
    });
    return updatedActiveIngredient;
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);

    const usedInProducts = await this.prisma.product.findMany({
      where: { activeIngredientId: id },
      select: { id: true, name: true },
    });

    if (usedInProducts.length > 0) {
      throw new ConflictException(
        `Cannot delete active ingredient. It is used in products: ${usedInProducts
          .map(p => p.name)
          .join(", ")}`,
      );
    }

    return this.prisma.activeIngredient.delete({ where: { id } });
  }

  async findByIdOrThrow(id: number) {
    const activeIngredient = await this.prisma.activeIngredient.findUnique({
      where: { id },
    });

    if (!activeIngredient)
      throw new ConflictException("Active Ingredient not found");
    return activeIngredient;
  }

  private async throwIfNameExists(name: string) {
    const existing = await this.prisma.activeIngredient.findUnique({
      where: { name },
    });

    if (existing)
      throw new ConflictException(
        "Active ingredient with this name already exists",
      );
    return existing;
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
      new Promise<{ name: string }[]>((resolve, reject) => {
        try {
          const workbook = XLSX.read(buffer, { type: "buffer" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<{ name: string }>(worksheet);
          resolve(rows);
        } catch (err) {
          reject(new Error(String(err)));
        }
      });

    const rows = await parseExcel(file.buffer);

    if (!rows.length) return { message: "No rows found in file" };

    let created = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = row.name?.trim();
      if (!name) continue;

      try {
        const existing = await this.prisma.activeIngredient.findUnique({
          where: { name },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await this.prisma.activeIngredient.create({ data: { name } });
        created++;
      } catch {
        skipped++;
      }
    }

    return {
      message: "Import completed",
      created,
      skipped,
      total: created + skipped,
    };
  }
}
