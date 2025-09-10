import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PatrolStatus } from '@prisma/client';
import { CreatePatrolDto } from './create-patrol.dto';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class UpdatePatrolDto extends PartialType(CreatePatrolDto) {
  @IsOptional()
  @IsEnum(PatrolStatus, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
  status?: PatrolStatus;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @Type(() => Date)
  endTime?: Date;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @Type(() => Date)
  pausedAt?: Date;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @Type(() => Date)
  resumedAt?: Date;

  @IsOptional()
  @IsBoolean()
  supervisorApproval?: boolean;
}    