import { Injectable } from '@nestjs/common';
import { CreateSystemAdminDto } from './dto/create-system-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateGuardDto } from './dto/create-guard.dto';
import { CreateHRDto } from './dto/create-hr.dto';
import { CreatePostResidentDto } from './dto/create-post-resident.dto';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { CreatePostSupervisorDto } from './dto/create-post-supervisor.dto';
import { BaseUserService } from './services/base-user.service';
import { UserRepository } from './repositories/user.repository';
import { UserValidator } from './validators/user.validator';
import { UserQueryService } from './services/user-query.service';
import {
  SystemAdminService,
  AdminService,
  SupervisorService,
  GuardService,
  HRService,
  PostSupervisorService,
  PostResidentService,
  UserPermissionService,
} from './services';

@Injectable()
export class UsersService extends BaseUserService {
  constructor(
    userRepository: UserRepository,
    userValidator: UserValidator,
    userQueryService: UserQueryService,
    userPermissionService: UserPermissionService,
    private systemAdminService: SystemAdminService,
    private adminService: AdminService,
    private supervisorService: SupervisorService,
    private guardService: GuardService,
    private hrService: HRService,
    private postSupervisorService: PostSupervisorService,
    private postResidentService: PostResidentService,
  ) {
    super(
      userRepository,
      userValidator,
      userQueryService,
      userPermissionService,
    );
  }

  //  Métodos de orquestração - delegam para serviços específicos
  async criarNovoSystemAdmin(dto: CreateSystemAdminDto) {
    return this.systemAdminService.criarNovoSystemAdmin(dto);
  }

  async criarNovoAdmin(dto: CreateAdminDto) {
    return this.adminService.criarNovoAdmin(dto);
  }

  async criarNovoHR(dto: CreateHRDto) {
    return this.hrService.criarNovoHR(dto);
  }

  async criarNovoSupervisor(dto: CreateSupervisorDto) {
    return this.supervisorService.criarNovoSupervisor(dto);
  }

  async criarNovoGuard(dto: CreateGuardDto) {
    return this.guardService.criarNovoGuard(dto);
  }

  async criarNovoPostSupervisor(dto: CreatePostSupervisorDto) {
    return this.postSupervisorService.criarNovoPostSupervisor(dto);
  }

  async criarNovoPostResident(dto: CreatePostResidentDto) {
    return this.postResidentService.criarNovoPostResident(dto);
  }
}
