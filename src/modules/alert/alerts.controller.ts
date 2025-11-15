import { Body, Controller, Get, Param, Post, Delete } from "@nestjs/common";
import { AlertsService } from "./alerts.service";
import { CreateAlertDto } from "./dto/create-alert.dto";

@Controller("alerts")
export class AlertsController {
  constructor(private readonly service: AlertsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.service.create(dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }

  @Post("/send")
  async send() {
    return await this.service.trigger();
  }
}
