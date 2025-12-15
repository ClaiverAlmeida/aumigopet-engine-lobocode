import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { VaccineExamType, VaccineExamStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateVaccineExamDto {
  @IsEnum(VaccineExamType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  type: VaccineExamType;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  name: string;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  date: string;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @IsOptional()
  nextDate?: string;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @IsOptional()
  reminderDate?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  location?: string;

  @IsEnum(VaccineExamStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  @IsOptional()
  status?: VaccineExamStatus;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  notes?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  document?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  petId: string;
}
