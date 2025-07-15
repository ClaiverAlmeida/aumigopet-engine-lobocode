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

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor, CaslInterceptor) // ✅ Adicionado CaslInterceptor
@RequiredRoles(Roles.SYSTEM_ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CaslRead('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  buscarTodos(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.usersService.buscarTodos(Number(page), Number(limit));
  }

  @Get(':id')
  @CaslRead('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  buscarPorId(@Param('id') id: string) {
    return this.usersService.buscarPorId(id);
  }

  @Post('system-admin')
  @CaslCreate('User')
  criarNovoSystemAdmin(@Body() dto: CreateSystemAdminDto) {
    return this.usersService.criarNovoSystemAdmin(dto);
  }

  @Post('admin')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN)
  criarNovoAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.criarNovoAdmin(dto);
  }

  @Post('hr')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  criarNovoHR(@Body() dto: CreateHRDto) {
    return this.usersService.criarNovoHR(dto);
  }

  @Post('supervisor')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  criarNovoSupervisor(@Body() dto: CreateSupervisorDto) {
    return this.usersService.criarNovoSupervisor(dto);
  }

  @Post('guard')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR)
  criarNovoGuard(@Body() dto: CreateGuardDto) {
    return this.usersService.criarNovoGuard(dto);
  }

  @Post('post-supervisor')
  @CaslCreate('User')
  @RequiredRoles(Roles.ADMIN, Roles.POST_SUPERVISOR)
  criarNovoPostSupervisor(@Body() dto: CreatePostSupervisorDto) {
    return this.usersService.criarNovoPostSupervisor(dto);
  }

  @Post('post-resident')
  @CaslCreate('User')
  @RequiredRoles(Roles.POST_RESIDENT)
  criarNovoPostResident(@Body() dto: CreatePostResidentDto) {
    return this.usersService.criarNovoPostResident(dto);
  }

  @Patch(':id')
  @CaslUpdate('User')
  @CaslFields('User', ['name', 'email', 'phone', 'address', 'status'])
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.POST_SUPERVISOR)
  atualizar(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.atualizar(id, updateUserDto);
  }

  @Delete(':id')
  @CaslDelete('User') 
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.POST_SUPERVISOR)
  desativar(@Param('id') id: string) {
    return this.usersService.desativar(id);
  }

  @Post(':id/restore')
  @CaslUpdate('User') 
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.POST_SUPERVISOR)
  reativar(@Param('id') id: string) {
    return this.usersService.reativar(id);
  }
}
