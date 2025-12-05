import { Injectable } from '@nestjs/common';
import { CreateSystemAdminDto } from './dto/create-system-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { BaseUserService } from './services/base-user.service';
import { UserRepository } from './repositories/user.repository';
import { UserValidator } from './validators/user.validator';
import { UserQueryService } from './services/user-query.service';
import {
  SystemAdminService,
  AdminService,
  UserPermissionService,
} from './services';
import { Prisma, Roles, UserStatus } from '@prisma/client';
import { UserFactory } from './factories/user.factory';

@Injectable()
export class UsersService extends BaseUserService {
  constructor(
    userRepository: UserRepository,
    userValidator: UserValidator,
    userQueryService: UserQueryService,
    userPermissionService: UserPermissionService,
    private systemAdminService: SystemAdminService,
    private adminService: AdminService,
    private userFactory: UserFactory,
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

  /**
   * Cria usuário comum
   */
  async criarNovoUser(dto: any) {
    // Validações comuns
    await this.validarSeEmailEhUnico(dto.email);
    if (dto.cpf) await this.validarSeCPFEhUnico(dto.cpf);
    if (dto.phone) await this.validarSePhoneEhUnico(dto.phone);

    // Criação do usuário
    const userData = this.userFactory.criarUser(dto);
    const user = await this.userRepository.criar(
      userData as Prisma.UserCreateInput,
    );

    return user;
  }

  /**
   * Busca usuários por role
   */
  async buscarUsersPorRole(role: Roles) {
    const whereClause = this.userQueryService.construirWhereClauseParaRead({
      role,
      status: UserStatus.ACTIVE,
    });

    const users = await this.userRepository.buscarMuitos(whereClause);
    return this.transformData(users);
  }
}
