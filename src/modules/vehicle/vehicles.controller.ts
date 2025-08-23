import { Controller, Get, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { UniversalController } from 'src/shared/universal/index';

@UseGuards(AuthGuard, RoleGuard)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN)
@Controller('vehicles')
export class VehiclesController extends UniversalController<
  CreateVehicleDto,
  UpdateVehicleDto,
  VehiclesService
> {
  constructor(service: VehiclesService) {
    super(service);
  }

  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  @Get('all')
  async buscarTodos() {
    return this.service.buscarTodos();
  }
}
