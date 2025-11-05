import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { BatcheService } from "./batche.service";
import { CreateBatcheDto } from "./dto/create-batche.dto";
import { UpdateBatcheDto } from "./dto/update-batche.dto";

@Controller("batches")
export class BatcheController {
  constructor(private readonly batcheService: BatcheService) {}

  @Post()
  create(@Body() createBatcheDto: CreateBatcheDto) {
    return this.batcheService.create(createBatcheDto);
  }

  @Get()
  findAll() {
    return this.batcheService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.batcheService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBatcheDto: UpdateBatcheDto,
  ) {
    return this.batcheService.update(id, updateBatcheDto);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.batcheService.remove(+id);
  // }
}
