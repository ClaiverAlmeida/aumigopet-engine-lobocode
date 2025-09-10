import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PatrolsService } from './patrols.service';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { UpdatePatrolDto } from './dto/update-patrol.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { UniversalController } from 'src/shared/universal/index';
import { TenantInterceptor } from 'src/shared/tenant';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.HR,
    Roles.SUPERVISOR,
    Roles.GUARD,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('patrols')
export class PatrolsController extends UniversalController<
  CreatePatrolDto,
  UpdatePatrolDto,
  PatrolsService
> {
  constructor(service: PatrolsService) {
    super(service);
  }

  // ============================================================================
  // 📋 ENDPOINTS ESPECÍFICOS PARA RONDAS
  // ============================================================================

  @Post('start')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async iniciarRonda(@Body() dto: CreatePatrolDto) {
    return this.service.iniciarRonda(dto);
  }

  @Patch(':id/pause')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async pausarRonda(@Param('id') id: string, @Body() dto: UpdatePatrolDto) {
    return this.service.pausarRonda(id, dto);
  }
  @Patch(':id/resume')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async resumirRonda(@Param('id') id: string, @Body() dto: UpdatePatrolDto) {
    return this.service.resumirRonda(id, dto);
  }
  @Patch(':id/complete')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async completarRonda(@Param('id') id: string, @Body() dto: UpdatePatrolDto) {
    return this.service.completarRonda(id, dto);
  }

  @Post(':id/supervision')
  @RequiredRoles(Roles.SUPERVISOR, Roles.GUARD, Roles.ADMIN)
  async salvarComSupervisao(
    @Param('id') id: string,
    @Body() dto: UpdatePatrolDto,
  ) {
    return this.service.salvarComSupervisao(id, dto);
  }

  @Get('checkpoints')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async buscarCheckpoints(@Req() req: any) {
    return this.service.buscarCheckpoints(req.user.companyId, req.user.postId);
  }

  @Get('in-progress')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async buscarEmAndamento() {
    return this.service.buscarEmAndamento();
  }

  @Patch(':patrolId/checkpoints/:checkpointId')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async atualizarCheckpoint(
    @Param('patrolId') patrolId: string,
    @Param('checkpointId') checkpointId: string,
    @Body() dto: UpdateCheckpointDto,
  ) {
    return this.service.atualizarCheckpoint(patrolId, checkpointId, dto);
  }

  // ============================================================================
  // 📋 ENDPOINTS HERDADOS DO UNIVERSAL CONTROLLER
  // ============================================================================

  @Get('all')
  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR)
  async buscarTodos() {
    return this.service.buscarTodos();
  }
}
