import { Injectable } from '@nestjs/common';
import { CreatePostResidentDto } from '../dto/create-post-resident.dto';
import { BaseUserService } from './base-user.service';
import { UserFactory } from '../factories/user.factory';
import { UserRepository } from '../repositories/user.repository';
import { UserValidator } from '../validators/user.validator';
import { UserQueryService } from './user-query.service';
import { Roles } from '@prisma/client';
import { UserPermissionService } from './user-permission.service';

@Injectable()
export class PostResidentService extends BaseUserService {
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
      Roles.POST_RESIDENT,
    );
  }

    //  Funcionalidades específicas de residentes de posto
  async criarNovoPostResident(dto: CreatePostResidentDto) {
    // ✅ Validação de role hierárquico RESTAURADA
    this.userPermissionService.validarCriacaoDeUserComRole(Roles.POST_RESIDENT);

    // Valida se email é único
    await this.validarSeEmailEhUnico(dto.email);
    // Criação do usuário
    const userData = this.userFactory.criarPostResident(dto);
    const user = await this.userRepository.criar(userData);

    return user;
  }

  /**
   * Busca usuários por posto
   */
  async buscarUsersPorPost(postId: string) {
    // // Valida permissão para leitura
    // this.validarPermissaoDeRead();
    // // // Com a nova estrutura, precisamos buscar através da tabela UserPost
    // // const userPosts = await this.prisma.userPost.findMany({
    // //   where: { postId },
    // //   include: {
    // //     user: {
    // //       include: this.userRepository['defaultInclude'],
    // //     },
    // //   },
    // // });
    // const users = userPosts.map((up) => up.user);
    // return this.validarResultadoDaBusca(users, 'Users', 'postId', postId);
  }
}
