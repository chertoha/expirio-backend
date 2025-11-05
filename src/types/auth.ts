// import { Role } from "generated/prisma";

import { Role } from "@prisma/client";

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};
