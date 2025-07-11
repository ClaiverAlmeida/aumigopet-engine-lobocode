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

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.HR)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  buscarTodos(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.usersService.buscarTodos(Number(page), Number(limit));
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.usersService.buscarPorId(id);
  }

  @Post('system-admin')
  criarNovoSystemAdmin(@Body() dto: CreateSystemAdminDto) {
    return this.usersService.criarNovoSystemAdmin(dto);
  }

  @Post('admin')
  criarNovoAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.criarNovoAdmin(dto);
  }

  @Post('hr')
  criarNovoHR(@Body() dto: CreateHRDto) {
    return this.usersService.criarNovoHR(dto);
  }

  @Post('supervisor')
  criarNovoSupervisor(@Body() dto: CreateSupervisorDto) {
    return this.usersService.criarNovoSupervisor(dto);
  }

  @Post('guard')
  criarNovoGuard(@Body() dto: CreateGuardDto) {
    return this.usersService.criarNovoGuard(dto);
  }

  @Post('post-supervisor')
  criarNovoPostSupervisor(@Body() dto: CreatePostSupervisorDto) {
    return this.usersService.criarNovoPostSupervisor(dto);
  }

  @Post('post-resident')
  criarNovoPostResident(@Body() dto: CreatePostResidentDto) {
    return this.usersService.criarNovoPostResident(dto);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.atualizar(id, updateUserDto);
  }

  @Delete(':id')
  desativar(@Param('id') id: string) {
    return this.usersService.desativar(id);
  }

  @Post(':id/restore')
  reativar(@Param('id') id: string) {
    return this.usersService.reativar(id);
  }
}
