import { Controller, UseGuards } from '@nestjs/common';
import { SharedTutorsService } from './shared-tutors.service';
import { CreateSharedTutorDto } from './dto/create-shared-tutor.dto';
import { UpdateSharedTutorDto } from './dto/update-shared-tutor.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
})
@Controller('shared-tutors')
export class SharedTutorsController extends UniversalController<
  CreateSharedTutorDto,
  UpdateSharedTutorDto,
  SharedTutorsService
> {
  constructor(service: SharedTutorsService) {
    super(service);
  }
}

