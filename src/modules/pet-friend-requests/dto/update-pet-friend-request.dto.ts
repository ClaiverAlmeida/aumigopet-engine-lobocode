import { PartialType } from '@nestjs/mapped-types';
import { CreatePetFriendRequestDto } from './create-pet-friend-request.dto';

export class UpdatePetFriendRequestDto extends PartialType(CreatePetFriendRequestDto) {}
