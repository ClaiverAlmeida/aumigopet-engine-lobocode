import { IsString, IsNumber, MinLength, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';

export class CreateProductDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  name: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.SLUG_INVALID })
  slug: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  description: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  price: number;
}
