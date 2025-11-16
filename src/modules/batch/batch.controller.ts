import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
} from "@nestjs/common";
import { BatchService } from "./batch.service";
import { CreateBatchDto } from "./dto/create-batch.dto";
import { UpdateBatchDto } from "./dto/update-batch.dto";
import { FindBatchesQueryDto } from "./dto/find-batches-query.dto";
@Controller("batches")
export class BatchController {
  constructor(private readonly BatchService: BatchService) {}

  @Post()
  create(@Body() CreateBatchDto: CreateBatchDto) {
    return this.BatchService.create(CreateBatchDto);
  }

  @Get()
  async findAll(@Query() query: FindBatchesQueryDto) {
    return this.BatchService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.BatchService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() UpdateBatchDto: UpdateBatchDto,
  ) {
    return this.BatchService.update(id, UpdateBatchDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.BatchService.remove(id);
  }
}
