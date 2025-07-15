import { Injectable } from '@nestjs/common';
import { CreatePostSupervisorDto } from '../dto/create-post-supervisor.dto';
import { BaseUserService } from './base-user.service';
import { UserFactory } from '../factories/user.factory';
import { UserRepository } from '../repositories/user.repository';
import { UserValidator } from '../validators/user.validator';
import { UserQueryService } from './user-query.service';
import { Roles } from '@prisma/client';
import { UserPermissionService } from './user-permission.service';

@Injectable()
export class PostSupervisorService extends BaseUserService {
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
      Roles.POST_SUPERVISOR,
    );
  }

    //  Funcionalidades específicas de supervisores de posto
  async criarNovoPostSupervisor(dto: CreatePostSupervisorDto) {
    // ✅ Validação de role hierárquico RESTAURADA
    this.userPermissionService.validarCriacaoDeUserComRole(Roles.POST_SUPERVISOR);

    // Valida se email é único
    await this.validarSeEmailEhUnico(dto.email);

    // Criação do usuário
    const userData = this.userFactory.criarPostSupervisor(dto);
    const user = await this.userRepository.criar(userData);

    return user;
  }
}
