import { IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreatePostLikeDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  postId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  userId: string;
}
