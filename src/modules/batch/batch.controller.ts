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
import { RelocateBatchDto } from "./dto/relocate-batch.dto";
import { WriteOffBatchDto } from "./dto/write-off-batch.dto";
@Controller("batches")
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  async create(@Body() CreateBatchDto: CreateBatchDto) {
    return await this.batchService.create(CreateBatchDto);
  }

  @Get()
  async findAll(@Query() query: FindBatchesQueryDto) {
    return await this.batchService.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.batchService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() UpdateBatchDto: UpdateBatchDto,
  ) {
    return await this.batchService.update(id, UpdateBatchDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.batchService.remove(id);
  }

  @Post("relocate")
  async relocate(@Body() relocateBatchDto: RelocateBatchDto) {
    return await this.batchService.relocate(relocateBatchDto);
  }

  @Post("write-off")
  async writeOff(@Body() writeOffBatchDto: WriteOffBatchDto) {
    return await this.batchService.writeOff(writeOffBatchDto);
  }
}
