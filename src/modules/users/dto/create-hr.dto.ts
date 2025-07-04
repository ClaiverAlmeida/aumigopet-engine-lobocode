import { Roles } from '@prisma/client';

export class CreateHRDto {
  name: string;
  email: string;
  password: string;
  companyId: string;
  role: Roles; // Deve ser Roles.HR
} 