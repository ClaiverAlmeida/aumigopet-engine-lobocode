import { Controller, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
  POST: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
  PATCH: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN],
  DELETE: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
})
@Controller('follows')
export class FollowsController extends UniversalController<
  CreateFollowDto,
  UpdateFollowDto,
  FollowsService
> {
  constructor(service: FollowsService) {
    super(service);
  }
}
