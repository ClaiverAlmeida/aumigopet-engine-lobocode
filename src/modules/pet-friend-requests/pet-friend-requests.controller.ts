import { Controller, UseGuards } from '@nestjs/common';
import { PetFriendRequestsService } from './pet-friend-requests.service';
import { CreatePetFriendRequestDto } from './dto/create-pet-friend-request.dto';
import { UpdatePetFriendRequestDto } from './dto/update-pet-friend-request.dto';
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
