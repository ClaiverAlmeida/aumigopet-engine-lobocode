import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export interface RoleByMethodConfig {
  GET?: UserRole[];
  POST?: UserRole[];
  PATCH?: UserRole[];
  PUT?: UserRole[];
  DELETE?: UserRole[];
}

export const ROLE_BY_METHOD_KEY = 'roleByMethod';

/**
 * Decorator para definir roles diferentes por método HTTP
 * 
 * @example
 * @RoleByMethod({
 *   GET: [UserRole.ADMIN, UserRole.HR, UserRole.GUARD, UserRole.SUPERVISOR],
 *   POST: [UserRole.ADMIN, UserRole.SUPERVISOR],
 *   PATCH: [UserRole.ADMIN, UserRole.SUPERVISOR],
 *   DELETE: [UserRole.ADMIN]
 * })
 */
export const RoleByMethod = (config: RoleByMethodConfig) =>
  SetMetadata(ROLE_BY_METHOD_KEY, config);
