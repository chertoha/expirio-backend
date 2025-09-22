import { Inject, Injectable } from "@nestjs/common";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/types/auth";
import { Response } from "express";
import { User } from "generated/prisma";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject("ACCESS_TOKEN_SERVICE")
    private readonly accessTokenService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, "password"> | null> {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await this.validatePassword(pass, user.password))) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async validateUserById(id: number): Promise<any> {
    const user = await this.userService.findOneById(id);

    if (user) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const access_token = this.accessTokenService.sign(payload);

    const userData = await this.userService.getUserData(user.id);

    return { user: userData, access_token };
  }

  async validatePassword(rawPassword: string, hash: string): Promise<boolean> {
    return await argon.verify(hash, rawPassword);
  }
}
