import { Controller, UseGuards } from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
  POST: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.SERVICE_PROVIDER],
  PATCH: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.SERVICE_PROVIDER],
  DELETE: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.SERVICE_PROVIDER],
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
