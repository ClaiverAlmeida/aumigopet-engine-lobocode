import { IsString, IsOptional, IsEnum, IsNumber, IsObject } from 'class-validator';
import { ServiceCategory, ServiceProviderStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateServiceProviderDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  name: string;

  @IsEnum(ServiceCategory, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  category: ServiceCategory;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  description?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  logo?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  phone?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  email?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  website?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  address?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  city?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  state?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  zipCode?: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  longitude?: number;

  @IsEnum(ServiceProviderStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  @IsOptional()
  status?: ServiceProviderStatus;

  @IsObject({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  openingHours?: any; // { "monday": "08:00-18:00", ... }

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  ownerId: string;
}
