import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  // Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ActiveIngredientService } from "./active-ingredient.service";
import { CreateActiveIngredientDto } from "./dto/create-active-ingredient.dto";
import { UpdateActiveIngredientDto } from "./dto/update-active-ingredient.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";

@Controller("active-ingredients")
export class ActiveIngredientController {
  constructor(
    private readonly activeIngredientService: ActiveIngredientService,
  ) {}

  @Post()
  create(@Body() createActiveIngredientDto: CreateActiveIngredientDto) {
    return this.activeIngredientService.create(createActiveIngredientDto);
  }

  @Get()
  findAll() {
    return this.activeIngredientService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.activeIngredientService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateActiveIngredientDto: UpdateActiveIngredientDto,
  ) {
    return this.activeIngredientService.update(id, updateActiveIngredientDto);
  }

  @Post("/import-excel")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    const result = await this.activeIngredientService.importFromExcel(file);
    return result;
  }
}
