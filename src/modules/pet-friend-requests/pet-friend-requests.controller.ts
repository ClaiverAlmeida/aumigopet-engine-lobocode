import { Controller, UseGuards } from '@nestjs/common';
import { PetFriendRequestsService } from './pet-friend-requests.service';
import { CreatePetFriendRequestDto } from './dto/create-pet-friend-request.dto';
import { UpdatePetFriendRequestDto } from './dto/update-pet-friend-request.dto';
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
@Controller('pet-friend-requests')
export class PetFriendRequestsController extends UniversalController<
  CreatePetFriendRequestDto,
  UpdatePetFriendRequestDto,
  PetFriendRequestsService
> {
  constructor(service: PetFriendRequestsService) {
    super(service);
  }
}
