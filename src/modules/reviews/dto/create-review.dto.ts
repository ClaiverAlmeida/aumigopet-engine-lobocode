import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateReviewDto {
  @IsInt({ message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @Min(1, { message: 'Rating deve ser no mínimo 1' })
  @Max(5, { message: 'Rating deve ser no máximo 5' })
  rating: number; // 1 a 5 estrelas

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  comment?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  providerId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  authorId: string;
}
