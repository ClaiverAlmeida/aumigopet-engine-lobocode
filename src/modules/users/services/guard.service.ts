import { Injectable } from '@nestjs/common';
import { CreateGuardDto } from '../dto/create-guard.dto';
import { BaseUserService } from './base-user.service';
import { UserFactory } from '../factories/user.factory';
import { UserRepository } from '../repositories/user.repository';
import { UserValidator } from '../validators/user.validator';
import { UserQueryService } from './user-query.service';
import { PermissionType, Roles } from '@prisma/client';
import { UserPermissionService } from './user-permission.service';

@Injectable()
export class GuardService extends BaseUserService {
  constructor(
    userRepository: UserRepository,
    userValidator: UserValidator,
    userQueryService: UserQueryService,
    userPermissionService: UserPermissionService,
    private userFactory: UserFactory,
  ) {
    super(
      userRepository,
      userValidator,
      userQueryService,
      userPermissionService,
      Roles.GUARD,
    );
  }

  //  Funcionalidades específicas de guardas
  async criarNovoGuard(dto: CreateGuardDto) {
    // ✅ Validação de role hierárquico RESTAURADA
    this.userPermissionService.validarCriacaoDeUserComRole(Roles.GUARD);

    // Valida se email é único
    await this.validarSeEmailEhUnico(dto.email);

    // Criação do usuário
    const userData = this.userFactory.criarGuard(dto);
    const user = await this.userRepository.criar(userData);
    // Permission
    if (dto.permissions) {
      await this.userRepository.criarPermissaoDeGuarda({
        userId: user.id,
        permissionType: dto.permissions,
      });
    }

    return user;
  }
}
