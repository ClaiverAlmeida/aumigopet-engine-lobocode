import { IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { BaseUserDto } from './base-user.dto';

export class CreateAdminDto extends BaseUserDto {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsEnum(UserRole, { message: VALIDATION_MESSAGES.REQUIRED.ROLE })
  role: UserRole; // Deve ser UserRole.ADMIN
}
