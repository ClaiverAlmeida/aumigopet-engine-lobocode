import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ForbiddenError,
  NotFoundError,
} from '../../../shared/common/errors';
import { UserRepository } from '../repositories/user.repository';
import { UserValidator } from '../validators/user.validator';
import { UserQueryService } from './user-query.service';
import { UserPermissionService } from './user-permission.service';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../../shared/common/messages';
import { Roles } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CrudAction } from '../../../shared/common/types'; 

@Injectable()
export class BaseUserService {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly userValidator: UserValidator,
    protected readonly userQueryService: UserQueryService,
    protected readonly userPermissionService: UserPermissionService, 
    protected targetRole?: Roles,
  ) {}

  // ============================================================================
  // 📋 MÉTODOS PÚBLICOS - OPERAÇÕES CRUD
  // ============================================================================

  /**
   * Lista todos os usuários com paginação
   */
  async buscarTodos(page = 1, limit = 20) {
    // Valida permissão para leitura
    this.validarPermissaoDeRead();

    const whereClause = this.construirWhereClauseComPermissao('read');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.buscarMuitos(whereClause, { skip, take: limit }),
      this.userRepository.contar(whereClause),
    ]);

    return {
      data: users,
      pagination: this.calcularInformacoesDePaginacao(page, limit, total),
    };
  }

  /**
   * Busca usuário por ID
   */
  async buscarPorId(id: string) {
    // Valida permissão para leitura
    this.validarPermissaoDeRead();

    const whereClause = this.construirWhereClauseComPermissao('read', { id });
    const user = await this.userRepository.buscarPrimeiro(whereClause);

    return this.validarResultadoDaBusca(user, 'User', 'id', id);
  }

  /**
   * Busca usuário por email
   */
  async buscarUserPorEmail(email: string) {
    // Valida permissão para leitura
    this.validarPermissaoDeRead();

    const user = await this.userRepository.buscarUnico({ email });
    return this.validarResultadoDaBusca(user, 'User', 'email', email);
  }

  /**
   * Busca usuários por empresa
   */
  async buscarUsersPorCompany(companyId: string) {
    // Valida permissão para leitura
    this.validarPermissaoDeRead();

    const whereClause = this.construirWhereClauseComPermissao('read', {
      companyId,
    });
    const users = await this.userRepository.buscarMuitos(whereClause);
    return this.validarResultadoDaBusca(users, 'Users', 'companyId', companyId);
  }

  /**
   * Atualiza dados do usuário
   */
  async atualizar(id: string, updateUserDto: UpdateUserDto) {
    //  Validação de atualização com CASL
    this.validarPermissaoDeUpdate();

    // Valida permissão para atualização
    const whereClause = this.construirWhereClauseComPermissao('update', { id });
    const user = await this.userRepository.buscarPrimeiro(whereClause);

    this.validarResultadoDaBusca(user, 'User', 'id', id);

    // Prepara dados para atualização
    const updateData = this.prepararDadosParaUpdate(updateUserDto);

    // Valida permissão para campos específicos
    this.userPermissionService.validarPermissoesDeCampo(updateData);

    return this.userRepository.atualizar({ id }, updateData);
  }

  /**
   * Soft delete - marca usuário como deletado
   */
  async desativar(id: string) {
    // Valida permissão para exclusão
    this.validarPermissaoDeDelete();

    const whereClause = this.construirWhereClauseComPermissao('delete', { id });
    const user = await this.userRepository.buscarPrimeiro(whereClause);

    if (!user) {
      throw new NotFoundError('User', id, 'id');
    }

    await this.userValidator.validarSeUserPodeSerDeletado(id);

    // Soft delete - marca como deletado
    const result = await this.userRepository.atualizar(
      { id },
      { deletedAt: new Date() },
    );

    return {
      message: SUCCESS_MESSAGES.CRUD.DELETED,
      data: result,
    };
  }

  /**
   * Restaura usuário deletado (soft delete)
   */
  async reativar(id: string) {
    // Valida permissão para atualização
    this.validarPermissaoDeUpdate();

    // Busca usuário deletado
    const whereClause = this.construirWhereClauseComPermissao('update', { id });
    const user = await this.userRepository.buscarPrimeiro({
      ...whereClause,
      deletedAt: { not: null }, // Só restaura se estiver deletado
    });

    if (!user) {
      throw new NotFoundError('User', id, 'id');
    }

    const result = await this.userRepository.atualizar(
      { id },
      { deletedAt: null },
    );

    return {
      message: SUCCESS_MESSAGES.CRUD.RESTORED,
      data: result,
    };
  }

  // ============================================================================
  //  MÉTODOS PROTEGIDOS - VALIDAÇÕES COMUNS
  // ============================================================================

  /**
   * Valida se usuário existe
   */
  protected async validarSeUserExiste(id: string) {
    return this.userValidator.validarSeUserExiste(id);
  }

  /**
   * Valida se empresa existe
   */
  protected async validarSeCompanyExiste(companyId: string) {
    return this.userValidator.validarSeCompanyExiste(companyId);
  }

  /**
   * Valida se email é único
   */
  protected async validarSeEmailEhUnico(email: string, excludeUserId?: string) {
    return this.userValidator.validarSeEmailEhUnico(email, excludeUserId);
  }

  /**
   * Valida formato do CPF único
   */
  protected async validarSeCPFEhUnico(cpf: string, excludeUserId?: string) {
    return this.userValidator.validarSeCPFEhUnico(cpf, excludeUserId);
  }

  /**
   * Valida formato do telefone único
   */
  protected async validarSePhoneEhUnico(phone: string, excludeUserId?: string) {
    return this.userValidator.validarSePhoneEhUnico(phone, excludeUserId);
  }

  // ============================================================================
  // 🔐 MÉTODOS PROTEGIDOS - VALIDAÇÕES DE PERMISSÃO
  // ============================================================================

  /**
   * Valida permissão para leitura de usuários
   * Centraliza validações de permissão e role para leitura
   */
  protected validarPermissaoDeRead(targetRole?: Roles) {
    this.validarPermissaoParaAction('read', targetRole);
  }
  /**
   * Valida permissão para criação de usuário
   * Centraliza validações de permissão e role para criação
   */
  protected validarPermissaoDeCreate(targetRole?: Roles) {
    this.validarPermissaoParaAction('create', targetRole);
  }

  /**
   * Valida permissão para atualização de usuário
   * Centraliza validações de permissão e role para atualização
   */
  protected validarPermissaoDeUpdate(targetRole?: Roles) {
    this.validarPermissaoParaAction('update', targetRole);
  }
  /**
   * Valida permissão para atualização de usuário
   * Centraliza validações de permissão e role para atualização
   */
  protected async validarPermissaoDeDelete() {
    await this.validarPermissaoParaAction('delete');
  }

  /**
   * Valida permissão de usuário para qualquer ação
   * Centraliza validações de permissão e role para qualquer ação
   */
  private validarPermissaoParaAction(action: CrudAction, targetRole?: Roles) {
    this.userPermissionService.validarAction(action);

    // Usa o role configurado no construtor ou o passado como parâmetro
    const roleToValidate = targetRole || this.targetRole;
    if (roleToValidate) {
      this.validarPermissaoParaRole(action, roleToValidate);
    }
  }

  // ============================================================================
  // 🔧 MÉTODOS PRIVADOS - UTILITÁRIOS CENTRALIZADOS
  // ============================================================================

  /**
   * Centraliza validação de permissão + construção de where clause
   * Reduz código duplicado em todos os métodos CRUD
   */
  private construirWhereClauseComPermissao(
    action: CrudAction,
    extra?: Prisma.UserWhereInput,
  ) {
    this.userPermissionService.validarAction(action);

    switch (action) {
      case 'read':
        return this.userQueryService.construirWhereClauseParaRead(extra);
      case 'create':
        return this.userQueryService.construirWhereClauseParaCreate();
      case 'update':
        return this.userQueryService.construirWhereClauseParaUpdate(
          extra?.id as string,
        );
      case 'delete':
        return this.userQueryService.construirWhereClauseParaDelete(
          extra?.id as string,
        );
    }
  }

  /**
   * Centraliza validação de role para qualquer ação
   * Padroniza a verificação de permissões hierárquicas
   */
  private validarPermissaoParaRole(action: CrudAction, targetRole: Roles) {
    if (
      !this.userPermissionService.validarAcaoDeUserComRole(action, targetRole)
    ) {
      throw new ForbiddenError(
        ERROR_MESSAGES.AUTHORIZATION.RESOURCE_ACCESS_DENIED,
      );
    }
  }

  // ============================================================================
  // 🔧 MÉTODOS UTILITÁRIOS - SIMPLIFICAM OPERAÇÕES COMUNS
  // ============================================================================

  /**
   * Prepara dados para atualização
   */
  private prepararDadosParaUpdate(
    updateUserDto: UpdateUserDto,
  ): Record<string, any> {
    const updateData: Record<string, any> = {};
    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.profilePicture)
      updateData.profilePicture = updateUserDto.profilePicture;
    if (updateUserDto.status !== undefined)
      updateData.status = updateUserDto.status;
    return updateData;
  }

  /**
   * Valida se resultado de busca não está vazio
   */
  protected validarResultadoDaBusca(
    result: any,
    entity: string,
    identifier: string,
    value: string,
  ): any {
    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new NotFoundError(entity, value, identifier);
    }
    return result;
  }

  /**
   * Calcula paginação
   */
  private calcularInformacoesDePaginacao(
    page: number,
    limit: number,
    total: number,
  ) {
    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
