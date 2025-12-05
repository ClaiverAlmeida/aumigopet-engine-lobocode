import { Controller, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
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
