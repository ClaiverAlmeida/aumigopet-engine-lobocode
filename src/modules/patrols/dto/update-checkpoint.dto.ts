import { IsEnum, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckpointStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class UpdateCheckpointDto {
  @IsEnum(CheckpointStatus, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
  status: CheckpointStatus;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  notes?: string;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @Type(() => Date)
  completedAt?: Date;
}
