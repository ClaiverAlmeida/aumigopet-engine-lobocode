import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { PetSpecies, PetGender } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreatePetDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  name: string;

  @IsEnum(PetSpecies, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  species: PetSpecies;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  breed?: string;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @IsOptional()
  birthDate?: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  age?: number;

  @IsEnum(PetGender, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  @IsOptional()
  gender?: PetGender;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  color?: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  weight?: number;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  microchip?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  profileImage?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  notes?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  dietaryRestrictions?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  allergies?: string;
}
