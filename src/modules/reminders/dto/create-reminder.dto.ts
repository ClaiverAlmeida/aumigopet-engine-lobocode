import { IsString, IsOptional, IsEnum, IsDateString, IsInt } from 'class-validator';
import { ReminderType, ReminderStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateReminderDto {
  @IsEnum(ReminderType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  type: ReminderType;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  title: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  date: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  time: string; // HH:MM

  @IsEnum(ReminderStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  @IsOptional()
  status?: ReminderStatus;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  notes?: string;

  // Campos específicos para medicação
  @IsInt({ message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  medicationDays?: number;

  @IsInt({ message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  currentDay?: number;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  dosage?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  frequency?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  petId: string;
}
