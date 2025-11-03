import { AuthService } from "./auth.service";
import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { Public } from "src/decorators/public.decorator";
import { type User } from "@prisma/client";
// import type { User } from "generated/prisma";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  async signIn(@CurrentUser() user: User) {
    return await this.authService.login(user);
  }
}
