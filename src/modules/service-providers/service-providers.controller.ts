import { Controller, UseGuards } from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
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
@Controller('service-providers')
export class ServiceProvidersController extends UniversalController<
  CreateServiceProviderDto,
  UpdateServiceProviderDto,
  ServiceProvidersService
> {
  constructor(service: ServiceProvidersService) {
    super(service);
  }
}
