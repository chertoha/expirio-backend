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
import { DrugFormService } from "./drug-form.service";
import { CreateDrugFormDto } from "./dto/create-drug-form.dto";
import { UpdateDrugFormDto } from "./dto/update-drug-form.dto";

@Controller("drug_forms")
export class DrugFormController {
  constructor(private readonly drugFormService: DrugFormService) {}

  @Post()
  create(@Body() createDrugFormDto: CreateDrugFormDto) {
    return this.drugFormService.create(createDrugFormDto);
  }

  @Get()
  findAll() {
    return this.drugFormService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.drugFormService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDrugFormDto: UpdateDrugFormDto,
  ) {
    return this.drugFormService.update(id, updateDrugFormDto);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.drugFormService.remove(+id);
  // }
}
