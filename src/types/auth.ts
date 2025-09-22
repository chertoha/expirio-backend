import { Role } from "generated/prisma";

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};
