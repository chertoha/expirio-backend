import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
