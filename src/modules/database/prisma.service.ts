import * as argon from "argon2";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, Role } from "@prisma/client";
// import { PrismaClient } from "@prisma/client";
// import { PrismaClient, Role } from "generated/prisma";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    await this.seed();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async seed() {
    const email = this.configService.getOrThrow("ROOT_ADMIN_EMAIL");
    const password = this.configService.getOrThrow("ROOT_ADMIN_PASSWORD");

    const hashedPassword = await argon.hash(password);

    await this.user.upsert({
      where: { email },
      update: {},
      create: {
        firstName: "Anton",
        lastName: "Chertok",
        email,
        password: hashedPassword,
        role: Role.ROOT,
      },
      omit: { password: true },
    });

    console.log("\x1b[34mRoot admin created successfully\x1b[0m");
  }
}
