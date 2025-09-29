import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { CreateSystemAdminDto } from './dto/create-system-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateGuardDto } from './dto/create-guard.dto';
import { CreateHRDto } from './dto/create-hr.dto';
import { CreatePostResidentDto } from './dto/create-post-resident.dto';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { CreatePostSupervisorDto } from './dto/create-post-supervisor.dto';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';

// 🎯 NOVOS DECORATORS CASL
import {
  CaslRead,
  CaslCreate,
  CaslUpdate,
  CaslDelete,
  CaslFields,
} from 'src/shared/casl/decorators/casl.decorator';
import { CaslInterceptor } from 'src/shared/casl/interceptors/casl.interceptor';
import { CreateOthersDto } from './dto/create-others.dto';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor, CaslInterceptor) // ✅ Adicionado CaslInterceptor
@RequiredRoles(Roles.SYSTEM_ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  criarNovoOthers(@Body() dto: CreateOthersDto) {
    return this.service.criarNovoOthers(dto);
  }

  @Get('all')
  @CaslRead('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  buscarTodosAll() {
    return this.service.buscarTodos();
  }

  @Get()
  @CaslRead('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.SUPERVISOR)
  buscarTodos(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.service.buscarTodos(Number(page), Number(limit));
  }

  @Get(':id')
  @CaslRead('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Get('active-guards-on-shift-post/:postId')
  @CaslRead('User')
  @RequiredRoles(
    Roles.ADMIN,
    Roles.HR,
    Roles.SUPERVISOR,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
    Roles.POST_SUPERVISOR,
    Roles.GUARD,
  )
  buscarVigilantesAtivosEmTurnoNoPosto(@Param('postId') postId: string) {
    return this.service.buscarVigilantesAtivosEmTurnoNoPosto(postId);
  }

  @Post('system-admin')
  @CaslCreate('User')
  criarNovoSystemAdmin(@Body() dto: CreateSystemAdminDto) {
    return this.service.criarNovoSystemAdmin(dto);
  }

  @Post('admin')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN)
  criarNovoAdmin(@Body() dto: CreateAdminDto) {
    return this.service.criarNovoAdmin(dto);
  }

  @Post('hr')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  criarNovoHR(@Body() dto: CreateHRDto) {
    return this.service.criarNovoHR(dto);
  }

  @Post('supervisor')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  criarNovoSupervisor(@Body() dto: CreateSupervisorDto) {
    return this.service.criarNovoSupervisor(dto);
  }

  @Post('guard')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  criarNovoGuard(@Body() dto: CreateGuardDto) {
    return this.service.criarNovoGuard(dto);
  }

  @Post('post-supervisor')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.POST_SUPERVISOR)
  criarNovoPostSupervisor(@Body() dto: CreatePostSupervisorDto) {
    return this.service.criarNovoPostSupervisor(dto);
  }

  @Post('post-resident')
  @CaslCreate('User')
  @RequiredRoles(Roles.POST_RESIDENT)
  criarNovoPostResident(@Body() dto: CreatePostResidentDto) {
    return this.service.criarNovoPostResident(dto);
  }

  @Patch(':id')
  @CaslUpdate('User')
  @CaslFields('User', ['name', 'email', 'phone', 'address', 'status'])
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.POST_SUPERVISOR)
  atualizar(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.atualizar(id, updateUserDto);
  }

  @Delete(':id')
  @CaslDelete('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.POST_SUPERVISOR)
  desativar(@Param('id') id: string) {
    return this.service.desativar(id);
  }

  @Post(':id/restore')
  @CaslUpdate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.POST_SUPERVISOR)
  reativar(@Param('id') id: string) {
    return this.service.reativar(id);
  }
}
