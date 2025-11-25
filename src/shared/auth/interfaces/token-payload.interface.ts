import { UserRole } from '@prisma/client';

export interface ITokenPayload {
  name: string;
  email: string;
  role: UserRole;
  sub: string;
  permissions: (string | any)[];
}
