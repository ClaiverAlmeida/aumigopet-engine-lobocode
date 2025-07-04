import { Roles } from '@prisma/client';

export class CreateGuardDto {
  name: string;
  email: string;
  password: string;
  companyId: string;
  unitIds: string[];
  role: Roles; // Deve ser Roles.GUARD
} 