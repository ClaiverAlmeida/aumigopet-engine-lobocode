import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehicleChecklistsService } from './vehicle-checklists.service';
import { CreateVehicleChecklistDto } from './dto/create-vehicle-checklist.dto';
import { UpdateVehicleChecklistDto } from './dto/update-vehicle-checklist.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR)
@Controller('vehicle-checklists')
export class VehicleChecklistsController extends UniversalController<
  CreateVehicleChecklistDto,
  UpdateVehicleChecklistDto,
  VehicleChecklistsService
> {
  constructor(service: VehicleChecklistsService) {
    super(service); 
  }
}
