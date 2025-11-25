import { IsString, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreatePetFriendRequestDto {
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  status?: string; // PENDING, ACCEPTED, REJECTED

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  note?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  requesterId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  petId: string;
}
