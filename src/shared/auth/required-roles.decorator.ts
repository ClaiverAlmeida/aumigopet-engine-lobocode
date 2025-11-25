import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const RequiredRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

//decorator - javascript - design pattern
// - documentar algo
// - influenciar o comportamento de algo
