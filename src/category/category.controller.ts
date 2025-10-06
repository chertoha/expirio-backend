import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiEntityResponses } from "src/decorators/api-entity-responses.decorator";
import { SelectApiResponses } from "src/decorators/select-api-responses.decorator";
import { imageTypePattern } from "../utils/pattern";

const ENTITY = "Category";
const CATEGORY_IMAGE_FILE_MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Antibiotics" },
        description: {
          type: "string",
          example: "Used for bacterial infections",
        },
        file: { type: "string", format: "binary" },
      },
      required: ["name", "description"],
    },
  })
  @ApiEntityResponses(HttpStatus.CREATED, ENTITY, CreateCategoryDto, "CREATED")
  @SelectApiResponses(["BAD_REQUEST", "UNAUTHORIZED", "FORBIDDEN", "CONFLICT"])
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: CATEGORY_IMAGE_FILE_MAX_SIZE }),
          new FileTypeValidator({ fileType: imageTypePattern }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.categoryService.create(createCategoryDto, file);
  }

  @Get()
  @ApiEntityResponses(HttpStatus.OK, ENTITY, [CreateCategoryDto], "FOUND_MANY")
  @SelectApiResponses(["BAD_REQUEST", "UNAUTHORIZED", "FORBIDDEN"])
  findAll() {
    return this.categoryService.findAll();
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Updated name" },
        description: { type: "string", example: "Updated description" },
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiEntityResponses(HttpStatus.OK, ENTITY, UpdateCategoryDto, "UPDATED")
  @SelectApiResponses(["BAD_REQUEST", "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND"])
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: CATEGORY_IMAGE_FILE_MAX_SIZE }),
          new FileTypeValidator({ fileType: imageTypePattern }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.categoryService.update(id, updateCategoryDto, file);
  }
}
