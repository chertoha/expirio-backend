import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, User } from "generated/prisma";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { Roles } from "src/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!requiredRoles)
      return ([Role.ADMIN, Role.ROOT] as Role[]).includes(user.role);

    return requiredRoles.includes(user.role);
  }
}
