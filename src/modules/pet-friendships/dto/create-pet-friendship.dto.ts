import { IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreatePetFriendshipDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  userId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  petId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  friendUserId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  friendPetId: string;
}
