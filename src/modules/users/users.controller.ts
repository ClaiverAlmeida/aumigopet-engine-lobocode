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
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';

// 🎯 CASL Decorators
import {
  CaslRead,
  CaslCreate,
  CaslUpdate,
  CaslDelete,
} from 'src/shared/casl/decorators/casl.decorator';
import { CaslInterceptor } from 'src/shared/casl/interceptors/casl.interceptor';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor, CaslInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // ============================================================================
  // 📋 CRUD BÁSICO DE USUÁRIOS
  // ============================================================================

  @Get()
  @CaslRead('User')
  @RequiredRoles(UserRole.ADMIN)
  buscarTodos(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('orderBy') orderBy: string = 'name',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'asc',
  ) {
    return this.service.buscarTodos(Number(page), Number(limit), orderBy, orderDirection);
  }

  @Get('search')
  @CaslRead('User')
  @RequiredRoles(Roles.ADMIN, Roles.HR, Roles.SUPERVISOR)
  buscarUsuarios(
    @Query('q') query: string = '',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('orderBy') orderBy: string = 'name',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'asc',
  ) {
    return this.service.buscarUsuarios(query, Number(page), Number(limit), orderBy, orderDirection);
  }

  @Get(':id')
  @CaslRead('User')
  @RequiredRoles(UserRole.ADMIN)
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @CaslUpdate('User')
  @RequiredRoles(UserRole.ADMIN)
  atualizar(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.atualizar(id, updateUserDto);
  }

  @Delete(':id')
  @CaslDelete('User')
  @RequiredRoles(UserRole.ADMIN)
  desativar(@Param('id') id: string) {
    return this.service.desativar(id);
  }

  @Post(':id/reativar')
  @CaslUpdate('User')
  @RequiredRoles(UserRole.ADMIN)
  reativar(@Param('id') id: string) {
    return this.service.reativar(id);
  }

  // ============================================================================
  // 👥 CRIAÇÃO DE USUÁRIOS POR TIPO
  // ============================================================================

  @Post('admin')
  @CaslCreate('User')
  @RequiredRoles(UserRole.ADMIN)
  criarNovoAdmin(@Body() dto: CreateAdminDto) {
    return this.service.criarNovoAdmin(dto);
  }

  @Post('user')
  @CaslCreate('User')
  criarNovoUser(@Body() dto: any) {
    return this.service.criarNovoUser(dto);
  }

  // ============================================================================
  // 🔍 BUSCA POR CRITÉRIOS ESPECÍFICOS
  // ============================================================================

  @Get('email/:email')
  @CaslRead('User')
  @RequiredRoles(UserRole.ADMIN)
  buscarPorEmail(@Param('email') email: string) {
    return this.service.buscarUserPorEmail(email);
  }

  @Get('company/:companyId')
  @CaslRead('User')
  @RequiredRoles(UserRole.ADMIN)
  buscarPorCompany(@Param('companyId') companyId: string) {
    return this.service.buscarUsersPorCompany(companyId);
  }

  @Get('role/:role')
  @CaslRead('User')
  @RequiredRoles(UserRole.ADMIN)
  buscarPorRole(@Param('role') role: UserRole) {
    return this.service.buscarUsersPorRole(role);
  }
}
