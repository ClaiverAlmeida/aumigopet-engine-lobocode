import { Roles } from '@prisma/client';

export class CreatePlatformAdminDto {
  name: string;
  email: string;
  password: string;
  role: Roles; // Deve ser Roles.PLATFORM_ADMIN
} 