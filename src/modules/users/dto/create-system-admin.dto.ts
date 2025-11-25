import { IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { BaseUserDto } from './base-user.dto';

export class CreateSystemAdminDto extends BaseUserDto {
  @IsEnum(UserRole, {
    message: VALIDATION_MESSAGES.REQUIRED.ROLE,
  })
  role: UserRole; // Deve ser UserRole.ADMIN
}
