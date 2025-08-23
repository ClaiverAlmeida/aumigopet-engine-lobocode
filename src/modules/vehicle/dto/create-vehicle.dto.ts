import {
  IsString,
  IsOptional,
  MinLength,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { VehicleType, VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.PLATE })
  @MinLength(6, { message: 'Placa deve ter pelo menos 6 caracteres' })
  plate: string;

  @IsEnum(VehicleType, { message: 'Tipo de veículo inválido' })
  type: VehicleType;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.MODEL })
  @MinLength(2, { message: 'Modelo deve ter pelo menos 2 caracteres' })
  model: string;

  @IsOptional()
  @IsEnum(VehicleStatus, { message: 'Status do veículo inválido' })
  status?: VehicleStatus;

  @IsOptional()
  @IsBoolean({ message: 'Campo isActive deve ser um booleano' })
  isActive?: boolean;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.REQUIRED.INITIAL_KM })
  @Min(0, { message: VALIDATION_MESSAGES.REQUIRED.INITIAL_KM })
  initialKm: number;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.REQUIRED.CURRENT_KM })
  @Min(0, { message: VALIDATION_MESSAGES.REQUIRED.CURRENT_KM })
  currentKm?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  notes?: string;
}
