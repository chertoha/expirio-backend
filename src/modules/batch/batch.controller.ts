import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { BatchService } from "./batch.service";
import { CreateBatchDto } from "./dto/create-batch.dto";
import { UpdateBatchDto } from "./dto/update-batch.dto";
import { FindBatchesQueryDto } from "./dto/find-batches-query.dto";
import { RelocateBatchDto } from "./dto/relocate-batch.dto";
import { WriteOffBatchDto } from "./dto/write-off-batch.dto";
import { QueryPageOptionsDto } from "../pageable/dto/query-options.dto";
import { DeleteStorageBatchDto } from "./dto/delete-storage-batch.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
@Controller("batches")
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  async create(@Body() CreateBatchDto: CreateBatchDto) {
    return await this.batchService.create(CreateBatchDto);
  }

  @Post("/import-excel")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    const result = await this.batchService.importFromExcel(file);
    return result;
  }

  @Get()
  async findAll(@Query() query: FindBatchesQueryDto) {
    return await this.batchService.findAll(query);
  }

  @Get("/storage-batch")
  async findStorageBatch(@Query() query: QueryPageOptionsDto) {
    return await this.batchService.findStorageBatches(query);
  }

  @Delete("/storage-batch")
  async deleteStorageBatch(
    @Body() deleteStorageBatchDto: DeleteStorageBatchDto,
  ) {
    return await this.batchService.deleteStorageBatch(deleteStorageBatchDto);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.batchService.findOne(id);
  }

  @Patch(":id")
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
