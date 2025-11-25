import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { WeightStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateWeightRecordDto {
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  weight: number; // Peso em kg

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @IsOptional()
  date?: string;

  @IsEnum(WeightStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  @IsOptional()
  status?: WeightStatus;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  notes?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  petId: string;
}
