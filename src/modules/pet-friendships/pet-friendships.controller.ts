import { Controller, UseGuards } from '@nestjs/common';
import { PetFriendshipsService } from './pet-friendships.service';
import { CreatePetFriendshipDto } from './dto/create-pet-friendship.dto';
import { UpdatePetFriendshipDto } from './dto/update-pet-friendship.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
  POST: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
  PATCH: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
  DELETE: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
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
