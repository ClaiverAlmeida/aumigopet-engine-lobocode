import { PartialType } from '@nestjs/mapped-types';
import { CreateSharedTutorDto } from './create-shared-tutor.dto';
import { IsEnum, IsOptional, IsArray, IsString } from 'class-validator';

export enum SharedTutorStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  REMOVED = 'REMOVED',
}

export class UpdateSharedTutorDto extends PartialType(CreateSharedTutorDto) {
  @IsEnum(SharedTutorStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: SharedTutorStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  petIds?: string[];
}

