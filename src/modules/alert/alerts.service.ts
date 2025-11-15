import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NodemailerEmailStrategy } from "./strategies/email.strategy";

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sengrid: NodemailerEmailStrategy,
  ) {}

  async create(createAlertDto: CreateAlertDto) {
    const { channels, ...data } = createAlertDto;

    return await this.prisma.alert.create({
      data: {
        ...data,
        channels: {
          create: channels.map(type => ({ type })),
        },
      },
      include: { channels: true },
    });
  }

  async findAll() {
    return await this.prisma.alert.findMany({ include: { channels: true } });
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);
    return await this.prisma.alert.delete({ where: { id } });
  }

  async findByIdOrThrow(id: number) {
    const alert = await this.prisma.alert.findUnique({ where: { id } });
    if (!alert) throw new NotFoundException("Alert not found");
    return alert;
  }

  async checkExpiringProducts() {
    const alerts = await this.prisma.alert.findMany({
      where: { isEnabled: true },
      include: { channels: true },
    });

    for (const alert of alerts) {
      const now = new Date();

      const targetDate = new Date(
        now.getTime() + alert.daysBefore * 24 * 60 * 60 * 1000,
      );

      const startOfTargetDay = new Date(targetDate);
      startOfTargetDay.setHours(0, 0, 0, 0);

      const endOfTargetDay = new Date(targetDate);
      endOfTargetDay.setHours(23, 59, 59, 999);

      const expiringBatches = await this.prisma.batch.findMany({
        where: {
          expirationDate: {
            gte: startOfTargetDay,
            lte: endOfTargetDay,
          },
        },
        include: {
          product: true,
          storages: {
            include: {
              storage: true,
            },
          },
        },
      });

      if (expiringBatches.length > 0) {
        this.logger.log(
          `Found ${expiringBatches.length} products for alert "${alert.name}"`,
        );

        for (const channel of alert.channels) {
          switch (channel.type) {
            case "EMAIL":
              await this.sengrid.sendAlert(alert, expiringBatches);
              break;
            // case 'SMS': ...
            // case 'PUSH': ...
          }
        }
      }
    }

    return alerts;
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.checkExpiringProducts();
  }

  async trigger() {
    await this.checkExpiringProducts();
  }
}
