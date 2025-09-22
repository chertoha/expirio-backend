import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AccessTokenServiceProvider } from "./providers/access-token.service.provider";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,

    LocalStrategy,
    JwtStrategy,

    AccessTokenServiceProvider,
  ],
  exports: [AuthService],
})
export class AuthModule {}
