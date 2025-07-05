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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { CreatePlatformAdminDto } from './dto/create-platform-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateGuardDto } from './dto/create-guard.dto';
import { CreateHRDto } from './dto/create-hr.dto';
import { CreateResidentDto } from './dto/create-resident.dto';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';

// @RequiredRoles(Roles.ADMIN)

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.HR)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Post('platform-admin')
  createPlatformAdmin(@Body() dto: CreatePlatformAdminDto) {
    return this.usersService.createPlatformAdmin(dto);
  }

  @Post('admin')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.createAdmin(dto);
  }

  @Post('guard')
  createGuard(@Body() dto: CreateGuardDto) {
    return this.usersService.createGuard(dto);
  }

  @Post('hr')
  createHR(@Body() dto: CreateHRDto) {
    return this.usersService.createHR(dto);
  }

  @Post('resident')
  createResident(@Body() dto: CreateResidentDto) {
    return this.usersService.createResident(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
