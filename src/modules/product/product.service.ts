import { ConflictException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const { name, barcode, dosage, dosageUnitId, activeIngredientId } =
      createProductDto;
    await this.findByNameOrThrow(name);
    const newProduct = await this.prisma.product.create({
      data: {
        name,
        barcode,
        dosage,
        dosageUnitId,
        activeIngredientId,
      },
    });

    return newProduct;
  }

  async findAll() {
    return await this.prisma.product.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, barcode, dosage, dosageUnitId, activeIngredientId } =
      updateProductDto;
    const existingStorage = await this.findByIdOrThrow(id);
    if (name && name !== existingStorage.name)
      await this.findByNameOrThrow(name);

    const updateProduct = await this.prisma.product.update({
      where: { id },
      data: { name, barcode, dosage, dosageUnitId, activeIngredientId },
    });
    return updateProduct;
  }

  private async findByIdOrThrow(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new ConflictException("Product not found");
    return product;
  }

  private async findByNameOrThrow(name: string) {
    const product = await this.prisma.product.findUnique({
      where: { name },
    });
    if (product)
      throw new ConflictException("Product with this name already exists");
    return product;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
