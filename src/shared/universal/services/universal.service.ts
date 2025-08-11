import { Inject, Optional } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { NotFoundError } from '../../common/errors';
import { SUCCESS_MESSAGES } from '../../common/messages';
import { UniversalQueryService } from './query.service';
import { UniversalRepository } from '../repositories/universal.repository';
import { UniversalPermissionService } from './permission.service';
import {
  UniversalAuditService,
  AuditFilters,
  UniversalMetrics,
} from './audit.service';
import { Roles } from '@prisma/client';
import { EntityNameCasl, EntityNameModel } from '../types';

/**
 * Serviço universal abstrato que fornece operações CRUD padronizadas
 * para todas as entidades do sistema.
 *
 * Inclui hooks para personalização, validações automáticas,
 * permissões CASL e multi-tenancy.
 */
export abstract class UniversalService {
  protected readonly entityName: EntityNameModel;
  protected readonly entityNameCasl: EntityNameCasl;

  constructor(
    protected repository: UniversalRepository,
    protected queryService: UniversalQueryService,
    protected permissionService: UniversalPermissionService,
    protected auditService: UniversalAuditService,
    @Optional() @Inject(REQUEST) private request: any,
    entityNameModel: EntityNameModel,
    entityNameCasl: EntityNameCasl,
  ) {
    this.entityName = entityNameModel;
    this.entityNameCasl = entityNameCasl;
  }

  // ============================================================================
  // 📖 MÉTODOS PÚBLICOS - OPERAÇÕES DE LEITURA
  // ============================================================================

  /**
   * Busca entidade por ID
   */
  async buscarPorId(id: string) {
    const whereClause = this.queryService.construirWhereClauseParaRead(
      this.entityNameCasl,
      { id },
    );
    const entity = await this.buscarEntidade(whereClause);

    this.validarResultadoDaBusca(entity, this.entityName, 'id', id);

    return { data: entity };
  }

  /**
   * Lista todas as entidades
   */
  async buscarTodos() {
    this.permissionService.validarAction(this.entityNameCasl, 'read');

    const whereClause = this.queryService.construirWhereClauseParaRead(
      this.entityNameCasl,
    );
    return this.repository.buscarMuitos(this.entityName, whereClause);
  }

  /**
   * Lista todas as entidades com paginação
   */
  async buscarComPaginacao(page = 1, limit = 20) {
    this.permissionService.validarAction(this.entityNameCasl, 'read');

    const whereClause = this.queryService.construirWhereClauseParaRead(
      this.entityNameCasl,
    );
    const skip = (page - 1) * limit;
    const [entities, total] = await Promise.all([
      this.repository.buscarMuitos(this.entityName, whereClause, {
        skip,
        take: limit,
      }),
      this.repository.contarTodos(this.entityName, whereClause),
    ]);

    const { totalPages, hasNextPage, hasPreviousPage } =
      this.calcularInformacoesDePaginacao(page, limit, total);

    return {
      data: entities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * Busca entidade por campo específico
   */
  async buscarPorCampo(field: string, value: any) {
    this.permissionService.validarAction(this.entityNameCasl, 'read');

    const whereClause = this.queryService.construirWhereClauseParaRead(
      this.entityNameCasl,
      { [field]: value },
    );
    const entity = await this.repository.buscarPrimeiro(
      this.entityName,
      whereClause,
    );

    this.validarResultadoDaBusca(
      entity,
      this.entityName,
      field,
      value.toString(),
    );

    return { data: entity };
  }

  /**
   * Busca múltiplas entidades por campo específico
   */
  async buscarMuitosPorCampo(field: string, value: any) {
    this.permissionService.validarAction(this.entityNameCasl, 'read');

    const whereClause = this.queryService.construirWhereClauseParaRead(
      this.entityNameCasl,
      { [field]: value },
    );
    const entities = await this.repository.buscarMuitos(
      this.entityName,
      whereClause,
    );

    return { data: entities };
  }

  // ============================================================================
  // ✏️ MÉTODOS PÚBLICOS - OPERAÇÕES DE ESCRITA
  // ============================================================================

  /**
   * Cria nova entidade
   */
  async criar(data: any, callback?: () => void, role?: Roles) {
    this.permissionService.validarAction(this.entityNameCasl, 'create');

    if (role) {
      this.permissionService.validarCriacaoDeEntidadeComRole(
        this.entityNameCasl,
        role,
      );
    }

    await this.beforeCreate(data);

    const entity = await this.repository.criar(this.entityName, data);

    // Registra auditoria da operação de criação
    await this.registrarOperacao('create', entity?.id, true);

    await this.afterCreate(data, entity);

    return entity;
  }

  /**
   * Atualiza entidade existente
   */
  async atualizar(id: string, updateEntityDto: any) {
    this.permissionService.validarAction(this.entityNameCasl, 'update');

    await this.beforeUpdate(id, updateEntityDto);

    const whereClause = this.queryService.construirWhereClauseParaUpdate(
      this.entityNameCasl,
      id,
    );

    const entity = await this.buscarEntidade(whereClause);

    this.validarResultadoDaBusca(entity, this.entityName, 'id', id);

    // Prepara dados para atualização (remove campos vazios)
    const updateData = this.prepararDadosParaUpdate(updateEntityDto);

    const updatedEntity = await this.repository.atualizar(
      this.entityName,
      { id },
      updateData,
    );

    // Registra auditoria da operação de atualização
    await this.registrarOperacao('update', id, true, { updateData });

    await this.afterUpdate(id, updateData, updatedEntity);

    return updatedEntity;
  }

  /**
   * Desativa entidade (soft delete)
   */
  async desativar(id: string) {
    this.permissionService.validarAction(this.entityNameCasl, 'delete');

    await this.beforeDelete(id);

    const whereClause = this.queryService.construirWhereClauseParaDelete(
      this.entityNameCasl,
      id,
    );
    const entity = await this.buscarEntidade(whereClause);

    if (!entity) {
      throw new NotFoundError(this.entityName, id, 'id');
    }

    await this.repository.desativar(this.entityName, { id });

    // Registra auditoria da operação de desativação
    await this.registrarOperacao('delete', id, true);

    await this.afterDelete(id);

    return {
      message: SUCCESS_MESSAGES.CRUD.DELETED,
    };
  }

  /**
   * Reativa entidade (restaura soft delete)
   */
  async reativar(id: string) {
    this.permissionService.validarAction(this.entityNameCasl, 'delete');

    await this.beforeRestore(id);

    const whereClause = this.queryService.construirWhereClauseParaUpdate(
      this.entityNameCasl,
      id,
    );
    const entity = await this.buscarEntidade(whereClause, true);

    if (!entity) {
      throw new NotFoundError(this.entityName, id, 'id');
    }

    await this.repository.reativar(this.entityName, { id });

    // Registra auditoria da operação de reativação
    await this.registrarOperacao('create', id, true, { tipo: 'reativacao' }); // create pois está "criando" novamente

    await this.afterRestore(id);

    return {
      message: SUCCESS_MESSAGES.CRUD.RESTORED,
    };
  }

  // ============================================================================
  // 🔍 MÉTODOS PÚBLICOS - VALIDAÇÕES E UTILITÁRIOS
  // ============================================================================

  /**
   * Valida existência de uma entidade
   */
  async validarExistencia(id: string, deletedAt: boolean = false) {
    const entity = await this.repository.buscarUnico(this.entityName, {
      id,
      deletedAt: deletedAt ? { not: null } : null,
    });

    if (!entity) {
      throw new NotFoundError(this.entityName, id, 'id');
    }
    return entity;
  }

  // ============================================================================
  // 📊 MÉTODOS PÚBLICOS - AUDITORIA E MÉTRICAS
  // ============================================================================

  /**
   * Obtém métricas específicas desta entidade
   */
  obterMetricas(
    periodo?: { inicio: Date; fim: Date },
    filtrosAdicionais?: Omit<AuditFilters, 'entityName'>,
  ): UniversalMetrics {
    const filtros: AuditFilters = {
      ...filtrosAdicionais,
      entityName: this.entityName,
    };

    return this.auditService.obterMetricas(periodo, filtros);
  }

  /**
   * Obtém logs específicos desta entidade
   */
  obterLogs(
    limite: number = 1000,
    periodo?: { inicio: Date; fim: Date },
    filtrosAdicionais?: Omit<AuditFilters, 'entityName'>,
  ) {
    return this.auditService.obterLogsPorEntidade(
      this.entityName,
      limite,
      periodo,
    );
  }

  /**
   * Obtém logs de falhas/erros específicos desta entidade
   */
  obterLogsFalhas(limite: number = 500, periodo?: { inicio: Date; fim: Date }) {
    const filtros: AuditFilters = {
      entityName: this.entityName,
      success: false,
    };

    return this.auditService.obterLogs(filtros, limite, periodo);
  }

  /**
   * Exporta logs desta entidade em diferentes formatos
   */
  exportarLogs(
    formato: 'json' | 'csv' = 'json',
    periodo?: { inicio: Date; fim: Date },
    filtrosAdicionais?: Omit<AuditFilters, 'entityName'>,
  ): string {
    const filtros: AuditFilters = {
      ...filtrosAdicionais,
      entityName: this.entityName,
    };

    return this.auditService.exportarLogs(formato, filtros, periodo);
  }

  /**
   * Obtém estatísticas de uso desta entidade
   */
  obterEstatisticasDeUso(periodo?: { inicio: Date; fim: Date }) {
    const metricas = this.obterMetricas(periodo);
    const totalRequests = metricas.totalRequests;
    const entityRequests = metricas.requestsByEntity[this.entityName] || 0;
    const percentualDoSistema =
      totalRequests > 0 ? (entityRequests / totalRequests) * 100 : 0;

    return {
      totalOperacoes: entityRequests,
      operacoesBemsucedidas: Math.round(
        entityRequests * (metricas.successRate / 100),
      ),
      operacoesFalharam:
        entityRequests -
        Math.round(entityRequests * (metricas.successRate / 100)),
      taxaDeSucesso: metricas.successRate,
      percentualDoSistema,
      acoesPopulares: metricas.requestsByAction,
      periodo: periodo || { descricao: 'Histórico completo' },
    };
  }

  // ============================================================================
  // 🎯 HOOKS DO CICLO DE VIDA - PARA SOBRESCRITA NAS CLASSES FILHAS
  // ============================================================================

  /**
   * Hook executado antes da criação
   * Sobrescreva para validações específicas
   */
  protected async beforeCreate(data: any): Promise<void> {}

  /**
   * Hook executado após a criação
   * Sobrescreva para ações pós-criação
   */
  protected async afterCreate(data: any, entity: any): Promise<void> {}

  /**
   * Hook executado antes da atualização
   * Sobrescreva para validações específicas
   */
  protected async beforeUpdate(id: string, data: any): Promise<void> {}

  /**
   * Hook executado após a atualização
   * Sobrescreva para ações pós-atualização
   */
  protected async afterUpdate(
    id: string,
    data: any,
    entity: any,
  ): Promise<void> {}

  /**
   * Hook executado antes da exclusão
   * Sobrescreva para validações específicas
   */
  protected async beforeDelete(id: string): Promise<void> {}

  /**
   * Hook executado após a exclusão
   * Sobrescreva para ações pós-exclusão
   */
  protected async afterDelete(id: string): Promise<void> {}

  /**
   * Hook executado antes da restauração
   * Sobrescreva para validações específicas
   */
  protected async beforeRestore(id: string): Promise<void> {}

  /**
   * Hook executado após a restauração
   * Sobrescreva para ações pós-restauração
   */
  protected async afterRestore(id: string): Promise<void> {}

  // ============================================================================
  // 🛡️ MÉTODOS PROTEGIDOS - VALIDAÇÕES E UTILITÁRIOS INTERNOS
  // ============================================================================

  /**
   * Valida se um campo é único na entidade
   */
  protected async validarSeEhUnico(
    campo: string,
    valor: any,
    excludeId?: string,
  ): Promise<boolean> {
    const whereClause: any = { [campo]: valor };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    // Só busca registros ativos (não deletados)
    whereClause.deletedAt = null;

    const existingEntity = await this.repository.buscarPrimeiro(
      this.entityName,
      whereClause,
    );

    return !existingEntity; // Retorna true se for único (não existe)
  }

  /**
   * Valida resultado da busca e lança erro se não encontrado
   */
  protected validarResultadoDaBusca(
    result: any,
    entity: string,
    identifier: string,
    value: string,
  ): any {
    if (!result) {
      throw new NotFoundError(entity, value, identifier);
    }
    return result;
  }

  // ============================================================================
  // 🔧 MÉTODOS PRIVADOS - UTILITÁRIOS INTERNOS
  // ============================================================================

  /**
   * Busca entidade aplicando filtros de soft delete
   */
  private async buscarEntidade(where: any, deletedAt: boolean = false) {
    const entity = await this.repository.buscarPrimeiro(this.entityName, {
      ...where,
      deletedAt: deletedAt ? { not: null } : null,
    });
    return entity;
  }

  /**
   * Calcula informações de paginação
   */
  private calcularInformacoesDePaginacao(
    page: number,
    limit: number,
    total: number,
  ) {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return { totalPages, hasNextPage, hasPreviousPage };
  }

  /**
   * Prepara dados para atualização removendo campos vazios
   */
  private prepararDadosParaUpdate(data: any): Record<string, any> {
    const updateData: Record<string, any> = {};

    // Só inclui campos que foram fornecidos e têm valor
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        updateData[key] = value;
      }
    });

    return updateData;
  }

  /**
   * Registra operação realizada na entidade para auditoria
   */
  private async registrarOperacao(
    action: 'create' | 'read' | 'update' | 'delete',
    resourceId?: string,
    success: boolean = true,
    context?: Record<string, any>,
  ): Promise<void> {
    try {
      // Obter usuário do contexto da requisição
      const user = this.request?.user;
      
      if (user) {
        this.auditService.registrarOperacao(
          user,
          action,
          this.entityName,
          this.entityNameCasl,
          success,
          {
            resourceId,
            additionalContext: context,
            ipAddress: this.request?.ip,
            userAgent: this.request?.headers?.['user-agent'],
          }
        );
      }
    } catch (error) {
      // Não interromper operação se auditoria falhar
      console.warn(`Falha ao registrar auditoria: ${error.message}`);
    }
  }
}
