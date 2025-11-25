import { PartialType } from '@nestjs/mapped-types';
import { CreatePetFriendshipDto } from './create-pet-friendship.dto';

export class UpdatePetFriendshipDto extends PartialType(CreatePetFriendshipDto) {}
