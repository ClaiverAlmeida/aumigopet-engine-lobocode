import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateCheckpointDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  name: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  latitude: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  longitude: number;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  order?: number;
}

export class CreatePatrolDto {
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  description?: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  userId?: string; // Vem do token se não fornecido

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string; // Vem do token se não fornecido

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  postId?: string; // Vem do usuário se não fornecido

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  shiftId?: string; // Vem do usuário se não fornecido

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCheckpointDto)
  checkpoints?: CreateCheckpointDto[];
}
