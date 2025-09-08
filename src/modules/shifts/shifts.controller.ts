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

  @RequiredRoles(Roles.GUARD, Roles.HR, Roles.ADMIN ,Roles.SYSTEM_ADMIN)
  @Get()
  buscarComPaginacao(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return super.buscarComPaginacao(page, limit);
  }

  @RequiredRoles(Roles.GUARD, Roles.HR)
  @Get('current')
  buscarEmAndamento() {
    return this.service.buscarEmAndamento();
  }

  @RequiredRoles(Roles.GUARD)
  @Post('start-time')
  async inicioDoTurno(@Body() data: CreateShiftDto) {
    return this.service.inicioDoTurno(data);
  }

  @RequiredRoles(Roles.GUARD)
  @Patch('break-start-time/:id')
  async inicioDoIntervalo(
    @Param('id') id: string,
    @Body() data: UpdateShiftDto,
  ) {
    return this.service.inicioDoIntervalo(id, data);
  }

  @RequiredRoles(Roles.GUARD)
  @Patch('break-end-time/:id')
  async fimDoIntervalo(@Param('id') id: string, @Body() data: UpdateShiftDto) {
    return this.service.fimDoIntervalo(id, data);
  }

  @RequiredRoles(Roles.GUARD)
  @Patch('end-time/:id')
  async fimDoTurno(@Param('id') id: string, @Body() data: UpdateShiftDto) {
    return this.service.fimDoTurno(id, data);
  }
}
