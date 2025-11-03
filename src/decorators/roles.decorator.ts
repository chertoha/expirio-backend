import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
// import { Role } from "generated/prisma";

export const Roles = Reflector.createDecorator<Role[]>();
