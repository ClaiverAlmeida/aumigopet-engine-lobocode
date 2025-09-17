import { IsOptional, IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { ShiftFunction, ShiftStatus } from '@prisma/client';
import { IsCUID } from 'src/shared/validators';

export class CreateShiftDto {
  // status

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsOptional() 
  postId?: string;

  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  startTime: Date;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  breakStartTime?: Date;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  breakEndTime?: Date;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  endTime?: Date;

  @IsOptional()
  @IsEnum(ShiftFunction, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
  function?: ShiftFunction;

  @IsOptional()
  @IsEnum(ShiftStatus, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
  status?: ShiftStatus;
}
