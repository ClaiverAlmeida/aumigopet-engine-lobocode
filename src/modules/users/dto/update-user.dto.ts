import { PartialType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';

export class UpdateUserDto extends PartialType(BaseUserDto) {
  @IsOptional()
  @IsEnum(UserRole, { message: VALIDATION_MESSAGES.REQUIRED.ROLE })
  role?: UserRole;
}
