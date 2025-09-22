import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Provider } from "@nestjs/common";
import { ACCESS_TOKEN_EXPIRATION_TIME } from "src/config/constants";

export const AccessTokenServiceProvider: Provider = {
  provide: "ACCESS_TOKEN_SERVICE",

  useFactory: (configService: ConfigService) =>
    new JwtService({
      secret: configService.get<string>("JWT_SECRET"),
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME },
    }),

  inject: [ConfigService],
};
