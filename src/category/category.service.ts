import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  private categories: (CreateCategoryDto & { file?: string })[] = [];

  create(dto: CreateCategoryDto, file?: Express.Multer.File) {
    const newCategory = { ...dto, file: file?.originalname };
    this.categories.push(newCategory);
    return {
      message: "Category created successfully",
      data: newCategory,
    };
  }

  findAll() {
    return this.categories;
  }

  update(id: number, dto: UpdateCategoryDto, file?: Express.Multer.File) {
    const index = this.categories.findIndex((_, i) => i === id - 1);
    if (index === -1) return { message: "Category not found" };

    this.categories[index] = {
      ...this.categories[index],
      ...dto,
      file: file?.originalname || this.categories[index].file,
    };
    return {
      message: "Category updated successfully",
      data: this.categories[index],
    };
  }
}
