import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PrismaService } from "../database/prisma.service";
import { AssignCategoryDto } from "./dto/assign-category.dto";
import { CategoryService } from "../category/category.service";
import { FindAssignCategoryQueryDto } from "./dto/find-assign-category-query.dto";
import { DeleteAssignedCategoryDto } from "./dto/delete-assigned-category.dto";
import { PageableService } from "../pageable/pageable.service";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";
import { Prisma } from "@prisma/client";
import { FindProductQueryDto } from "./dto/find-product-query.dto";

const include: Prisma.ProductInclude = {
  categories: { include: { category: true } },
  dosageUnit: true,
  forms: { include: { form: true } },
  activeIngredient: true,
};

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly pageableService: PageableService,
  ) {}

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

  async findAll(queryDto: FindProductQueryDto) {
    const { categoryId, activeIngredientId } = queryDto;

    const where: Prisma.ProductWhereInput = {
      ...(categoryId && { categories: { some: { categoryId } } }),
      ...(activeIngredientId && { activeIngredientId }),
    };

    return await this.pageableService.findAll(
      "product",
      queryDto,
      where,
      include,
    );
  }

  async findOne(id: number) {
    return await this.findByIdOrThrow(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, barcode, dosage, dosageUnitId, activeIngredientId } =
      updateProductDto;
    const existingProduct = await this.findByIdOrThrow(id);
    if (name && name !== existingProduct.name)
      await this.findByNameOrThrow(name);

    const updateProduct = await this.prisma.product.update({
      where: { id },
      data: { name, barcode, dosage, dosageUnitId, activeIngredientId },
    });
    return updateProduct;
  }

  async findByIdOrThrow(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException("Product not found");
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

  async delete(id: number) {
    await this.findByIdOrThrow(id);

    const usedProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        batches: true,
      },
    });

    const hasBatches = !!usedProduct?.batches.length;
    if (hasBatches)
      throw new ConflictException("This product is used in batches");

    await this.prisma.$transaction(async t => {
      await t.productCategory.deleteMany({ where: { productId: id } });
      await t.productForm.deleteMany({ where: { productId: id } });
      await t.product.delete({ where: { id } });
    });
  }

  async assignCategory(assignCategoryDto: AssignCategoryDto) {
    const { productIds, categoryId } = assignCategoryDto;

    const existingProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (existingProducts.length !== productIds.length)
      throw new NotFoundException(`Some products don't exist, ids`);

    await this.categoryService.findByIdOrThrow(categoryId);

    const assignedData = productIds.map(productId => ({
      productId,
      categoryId,
    }));

    return await this.prisma.productCategory.createMany({
      data: assignedData,
      skipDuplicates: true,
    });
  }

  async findAssignedCategories(queryDto: FindAssignCategoryQueryDto) {
    const { categoryId, productId } = queryDto;

    // if ((categoryId && !productId) || (!categoryId && productId))
    //   throw new BadRequestException("Needed both categoryId and productId");

    return await this.prisma.productCategory.findMany({
      where: { ...(categoryId && categoryId && { categoryId, productId }) },
      include: { product: true, category: true },
    });
  }

  async deleteAssignedCategory(
    deleteAssignedCategoryDto: DeleteAssignedCategoryDto,
  ) {
    const { productIds, categoryId } = deleteAssignedCategoryDto;

    const existingProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (existingProducts.length !== productIds.length)
      throw new NotFoundException(`Some products don't exist, ids`);

    await this.categoryService.findByIdOrThrow(categoryId);

    return await this.prisma.productCategory.deleteMany({
      where: { categoryId, productId: { in: productIds } },
    });
  }
}
