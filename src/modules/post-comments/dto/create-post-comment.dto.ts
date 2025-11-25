import { IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreatePostCommentDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  content: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  postId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  authorId: string;
}
