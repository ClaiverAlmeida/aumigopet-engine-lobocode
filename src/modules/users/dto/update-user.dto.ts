import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';
import {
  IsCPF,
  IsPhoneNumberBR,
  IsUniqueCPF,
} from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  name?: string;
  
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  profilePicture?: string;

  @IsOptional()
  @IsCPF({ message: VALIDATION_MESSAGES.FORMAT.CPF_INVALID })
  @IsUniqueCPF({ message: VALIDATION_MESSAGES.UNIQUENESS.CPF_EXISTS })
  cpf?: string;

  @IsOptional()
  @IsPhoneNumberBR({ message: VALIDATION_MESSAGES.FORMAT.PHONE_INVALID })
  phone?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  address?: string;

  @IsOptional()
  @IsEnum(UserStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status?: UserStatus;
}
