import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  // Query,
  Put,
  ParseIntPipe,
} from "@nestjs/common";
import { DosageUnitService } from "./dosage-unit.service";
import { UpdateDosageUnitDto } from "./dto/update-dosage-unit.dto";
import { CreateDosageUnitDto } from "./dto/create-dosage-unit.dto";
// import { FindDosageUnitDto } from "./dto/find-dosage-unit.dto";

@Controller("dosage-units")
export class DosageUnitController {
  constructor(private readonly dosageUnitService: DosageUnitService) {}

  @Post()
  create(@Body() createDosageUnitDto: CreateDosageUnitDto) {
    return this.dosageUnitService.create(createDosageUnitDto);
  }

  @Get()
  findAll() {
    return this.dosageUnitService.findAll();
  }
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.dosageUnitService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDosageUnitDto: UpdateDosageUnitDto,
  ) {
    return this.dosageUnitService.update(id, updateDosageUnitDto);
  }
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.dosageUnitService.remove(id);
  }
}
