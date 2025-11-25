import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateServiceDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  name: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  price?: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  duration?: number; // Duração em minutos

  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  isActive?: boolean;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  providerId: string;
}
