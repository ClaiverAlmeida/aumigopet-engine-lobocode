import { IsOptional, IsObject, IsEmail, IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateSharedTutorDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID })
  inviteEmail: string;

  @IsArray({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsString({ each: true, message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  petIds: string[];

  @IsObject({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  permissions?: {
    canEdit?: boolean;
    canViewMedical?: boolean;
    canSchedule?: boolean;
  };
}

