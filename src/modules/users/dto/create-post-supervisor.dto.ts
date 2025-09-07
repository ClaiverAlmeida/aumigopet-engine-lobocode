import { IsOptional } from 'class-validator';
import { Roles } from '@prisma/client';
import { IsCUID, IsExpectedRole } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { BaseUserDto } from './base-user.dto';

export class CreatePostSupervisorDto extends BaseUserDto {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  postId?: string;

  @IsExpectedRole(Roles.POST_SUPERVISOR, { message: VALIDATION_MESSAGES.REQUIRED.ROLE })
  role: Roles; // Deve ser Roles.POST_SUPERVISOR
} 