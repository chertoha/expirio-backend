import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  NotEquals,
} from "class-validator";
import { Role } from "generated/prisma";

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role, { message: "role must be one of the following values: ADMIN" })
  @NotEquals(Role[Role.ROOT])
  @IsOptional()
  role?: Role;
}
