import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN)
@Controller('shifts')
export class ShiftsController extends UniversalController<
  CreateShiftDto,
  UpdateShiftDto,
  ShiftsService
> {
  constructor(service: ShiftsService) {
    super(service);
  }

  @RequiredRoles(
    Roles.SUPERVISOR,
    Roles.GUARD,
    Roles.HR,
    Roles.ADMIN,
    Roles.SYSTEM_ADMIN,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  )
  @Get()
  buscarComPaginacao(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return super.buscarComPaginacao(page, limit);
  }

  @RequiredRoles(
    Roles.SUPERVISOR,
    Roles.GUARD,
    Roles.HR,
    Roles.ADMIN,
    Roles.SYSTEM_ADMIN,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  )
  @Get('current')
  buscarEmAndamento() {
    return this.service.buscarEmAndamento();
  }

  @RequiredRoles(
    Roles.SUPERVISOR,
    Roles.GUARD,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  )
  @Post('start-time')
  async inicioDoTurno(@Body() data: CreateShiftDto) {
    return this.service.inicioDoTurno(data);
  }

  @RequiredRoles(
    Roles.SUPERVISOR,
    Roles.GUARD,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  )
  @Patch('break-start-time/:id')
  async inicioDoIntervalo(
    @Param('id') id: string,
    @Body() data: UpdateShiftDto,
  ) {
    return this.service.inicioDoIntervalo(id, data);
  }

  @RequiredRoles(
    Roles.SUPERVISOR,
    Roles.GUARD,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  )
  @Patch('break-end-time/:id')
  async fimDoIntervalo(@Param('id') id: string, @Body() data: UpdateShiftDto) {
    return this.service.fimDoIntervalo(id, data);
  }

  @RequiredRoles(
    Roles.SUPERVISOR,
    Roles.GUARD,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  )
  @Patch('end-time/:id')
  async fimDoTurno(@Param('id') id: string, @Body() data: UpdateShiftDto) {
    return this.service.fimDoTurno(id, data);
  }
}
