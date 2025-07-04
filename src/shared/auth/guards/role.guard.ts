import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { Request } from 'express';
import { ForbiddenError } from 'src/shared/common/errors';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const requiredRoles = this.reflector.get<Roles[]>(
    //   'roles',
    //   context.getHandler(),
    // );

    // Busca no handler e, se não achar, no controller
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authUser = request.user;

    const isUnauthorized =
      authUser!.role !== Roles.PLATFORM_ADMIN &&
      authUser!.role !== Roles.ADMIN &&
      !requiredRoles.includes(authUser!.role);

    if (isUnauthorized) {
      throw new ForbiddenError(
        'You do not have permission to access this resource.'
      );
    }
    return true;
  }
}
