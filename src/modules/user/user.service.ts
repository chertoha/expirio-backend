import * as argon from "argon2";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "../database/prisma.service";
import { Role, User } from "generated/prisma";
import { createNotFoundEntityMessage } from "src/utils/messages";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, "password">> {
    const { firstName, lastName, email, password, role } = createUserDto;

    const existedUser = await this.prisma.user.findUnique({ where: { email } });
    if (existedUser)
      throw new ConflictException(`User with email:${email} already exists`);

    return await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        role: role || Role.USER,
        email,
        password: await argon.hash(password),
      },
      omit: { password: true },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({ omit: { password: true } });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user)
      throw new NotFoundException(createNotFoundEntityMessage("User")(id));
    if (user.role === Role.ROOT)
      throw new ConflictException("You cannot delete root user");

    return await this.prisma.user.delete({
      where: { id },
      omit: { password: true },
    });
  }

  async getUserData(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
