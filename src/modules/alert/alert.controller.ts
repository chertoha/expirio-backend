import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { AlertService } from "./alert.service";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { SetEnableAlertDto } from "./dto/set-enable-alert.dto";

@Controller("alerts")
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  findAll() {
    return this.alertService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.alertService.create(dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.alertService.remove(id);
  }

  @Post("/send")
  async send() {
    return await this.alertService.trigger();
  }

  @Patch(":id/enable")
  async enable(
    @Param("id", ParseIntPipe) id: number,
    @Body() setEnableAlertDto: SetEnableAlertDto,
  ) {
    return await this.alertService.enable(id, setEnableAlertDto);
  }
}
