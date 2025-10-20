import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  // Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { ActiveIngredientService } from "./active-ingredient.service";
import { CreateActiveIngredientDto } from "./dto/create-active-ingredient.dto";
import { UpdateActiveIngredientDto } from "./dto/update-active-ingredient.dto";

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

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.activeIngredientService.remove(+id);
  // }
}
