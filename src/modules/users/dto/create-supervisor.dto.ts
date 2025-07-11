import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { Roles } from '@prisma/client';
import {
  IsCPF,
  IsPhoneNumberBR,
  IsStrongPassword,
  IsUniqueEmail,
  IsUniqueCPF,
  IsCUID,
  IsExpectedRole,
  IsUniqueLogin,
} from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateSupervisorDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  name: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.LOGIN })
  @MinLength(3, { message: VALIDATION_MESSAGES.LENGTH.LOGIN_MIN })
  @IsUniqueLogin({ message: VALIDATION_MESSAGES.UNIQUENESS.LOGIN_EXISTS })
  login: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID })
  @IsUniqueEmail({
    message: VALIDATION_MESSAGES.UNIQUENESS.EMAIL_EXISTS,
  })
  email: string;

  @IsStrongPassword({ message: VALIDATION_MESSAGES.FORMAT.PASSWORD_WEAK })
  password: string;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId: string;

  @IsExpectedRole(Roles.SUPERVISOR, {
    message: VALIDATION_MESSAGES.REQUIRED.ROLE,
  })
  role: Roles; // Deve ser Roles.SUPERVISOR

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
}
