import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { MotorizedServicesService } from './motorized-service.service';
import { CreateMotorizedServiceDto } from './dto/create-motorized-service.dto';
import { UpdateMotorizedServiceDto } from './dto/update-motorized-service.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.SUPERVISOR, Roles.GUARD)
@Controller('motorized-services')
export class MotorizedServicesController extends UniversalController<
  CreateMotorizedServiceDto,
  UpdateMotorizedServiceDto,
  MotorizedServicesService
> {
  constructor(service: MotorizedServicesService) {
    super(service);
  }
}
