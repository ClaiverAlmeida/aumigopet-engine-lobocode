import { Roles } from '@prisma/client';

export class CreateResidentDto {
  name: string;
  email: string;
  password: string;
  companyId: string;
  unitId: string;
  role: Roles; // Deve ser Roles.RESIDENT
} 