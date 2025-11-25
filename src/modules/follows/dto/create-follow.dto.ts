import { IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateFollowDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  followerId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  followingId: string;
}
