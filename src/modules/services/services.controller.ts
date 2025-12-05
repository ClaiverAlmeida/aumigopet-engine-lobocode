import { Controller, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.SERVICE_PROVIDER],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.SERVICE_PROVIDER],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.SERVICE_PROVIDER],
})
@Controller('services')
export class ServicesController extends UniversalController<
  CreateServiceDto,
  UpdateServiceDto,
  ServicesService
> {
  constructor(service: ServicesService) {
    super(service);
  }
}
