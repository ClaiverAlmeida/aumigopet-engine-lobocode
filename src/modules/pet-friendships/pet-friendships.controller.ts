import { Controller, UseGuards } from '@nestjs/common';
import { PetFriendshipsService } from './pet-friendships.service';
import { CreatePetFriendshipDto } from './dto/create-pet-friendship.dto';
import { UpdatePetFriendshipDto } from './dto/update-pet-friendship.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
})
@Controller('pet-friendships')
export class PetFriendshipsController extends UniversalController<
  CreatePetFriendshipDto,
  UpdatePetFriendshipDto,
  PetFriendshipsService
> {
  constructor(service: PetFriendshipsService) {
    super(service);
  }
}
