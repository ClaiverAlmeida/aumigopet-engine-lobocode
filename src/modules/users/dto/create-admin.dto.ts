import { Roles } from '@prisma/client';

export class CreateAdminDto {
  name: string;
  email: string;
  password: string;
  companyId: string;
  role: Roles; // Deve ser Roles.ADMIN
}
