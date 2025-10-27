import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "./modules/auth/guards/roles.guard";
import { CategoryModule } from "./modules/category/category.module";
import { DosageUnitModule } from "./modules/dosage-unit/dosage-unit.module";
import { ActiveIngredientModule } from "./modules/active-ingredient/active-ingredient.module";
import { PageableModule } from "./modules/pageable/pageable.module";
import { DrugFormModule } from './modules/drug-form/drug-form.module';
import { StoragesModule } from './modules/storages/storages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    CategoryModule,
    DosageUnitModule,
    ActiveIngredientModule,
    PageableModule,
    DrugFormModule,
    StoragesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
