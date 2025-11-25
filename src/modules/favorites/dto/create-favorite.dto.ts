import { IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateFavoriteDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  providerId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  userId: string;
}
