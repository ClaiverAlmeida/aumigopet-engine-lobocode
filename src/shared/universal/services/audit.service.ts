import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { CrudAction } from '../../casl/casl.service';
import { EntityNameCasl, EntityNameModel } from '../types';

// ============================================================================
// 🏷️ INTERFACES GENÉRICAS PARA AUDITORIA
// ============================================================================

export interface UniversalAuditLog {
  // Informações do usuário
  userId: string;
  userRole: string;
  userCompanyId?: string;

  // Informações da ação
  action: CrudAction;
  entityName: EntityNameModel;
  entityNameCasl: EntityNameCasl;
  resourceId?: string;
  
  // Contexto específico da entidade
  relatedIds?: {
    companyId?: string;
    postId?: string;
    vehicleId?: string;
    shiftId?: string;
    [key: string]: string | undefined;
  };

  // Informações técnicas
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;

  // Contexto adicional
  context?: Record<string, any>;
}

export interface UniversalMetrics {
  // Estatísticas gerais
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;

  // Top actions por entidade
  mostRequestedByEntity: Array<{
    entityName: string;
    action: string;
    count: number;
  }>;

  // Top negados por entidade
  mostDeniedByEntity: Array<{
    entityName: string;
    action: string;
    count: number;
    errorMessage?: string;
  }>;

  // Estatísticas por dimensões
  requestsByRole: Record<string, number>;
  requestsByCompany: Record<string, number>;
  requestsByEntity: Record<string, number>;
  requestsByAction: Record<string, number>;

  // Análise temporal (se período especificado)
  requestsByHour?: Record<string, number>;
  requestsByDay?: Record<string, number>;
}

export interface AuditFilters {
  entityName?: EntityNameModel | EntityNameModel[];
  entityNameCasl?: EntityNameCasl | EntityNameCasl[];
  userId?: string | string[];
  userRole?: string | string[];
  companyId?: string | string[];
  action?: CrudAction | CrudAction[];
  success?: boolean;
  resourceId?: string | string[];
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
  searchText?: string; // Busca em contexto ou errorMessage
}

// ============================================================================
// 📊 SERVIÇO UNIVERSAL DE AUDITORIA
// ============================================================================

@Injectable()
export class UniversalAuditService {
  private readonly logger = new Logger(UniversalAuditService.name);
  private auditLogs: UniversalAuditLog[] = [];
  private readonly MAX_LOGS = 50000; // Limite maior para sistema universal

  // ============================================================================
  // 📝 MÉTODOS PÚBLICOS - REGISTRO DE AUDITORIA
  // ============================================================================

  /**
   * Registra uma operação realizada em qualquer entidade
   */
  registrarOperacao(
    user: User,
    action: CrudAction,
    entityName: EntityNameModel,
    entityNameCasl: EntityNameCasl,
    success: boolean,
    context?: {
      resourceId?: string;
      relatedIds?: Record<string, string>;
      ipAddress?: string;
      userAgent?: string;
      errorMessage?: string;
      additionalContext?: Record<string, any>;
    },
  ): void {
    const auditLog: UniversalAuditLog = {
      // Usuário
      userId: user.id,
      userRole: user.role,
      userCompanyId: user.companyId || undefined,

      // Ação
      action,
      entityName,
      entityNameCasl,
      resourceId: context?.resourceId,

      // IDs relacionados dinâmicos
      relatedIds: {
        companyId: context?.relatedIds?.companyId || user.companyId || undefined,
        ...context?.relatedIds,
      },

      // Técnico
      timestamp: new Date(),
      success,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
      errorMessage: context?.errorMessage,
      context: context?.additionalContext,
    };

    this.adicionarLog(auditLog);

    // Log apenas falhas para não poluir
    if (!success) {
      this.logger.warn(
        `[${entityName.toUpperCase()}] ${action.toUpperCase()} NEGADO - User: ${user.id} (${user.role}) | Resource: ${context?.resourceId || 'N/A'} | Error: ${context?.errorMessage || 'Unknown'}`,
      );
    }
  }

  /**
   * Registra tentativa de acesso/validação de permissão
   */
  registrarTentativaPermissao(
    user: User,
    action: CrudAction,
    entityNameCasl: EntityNameCasl,
    success: boolean,
    context?: {
      resourceId?: string;
      relatedIds?: Record<string, string>;
      ipAddress?: string;
      userAgent?: string;
      errorMessage?: string;
    },
  ): void {
    // Converte CASL name para model name para consistência
    const entityName = this.getModelNameFromCasl(entityNameCasl);

    this.registrarOperacao(
      user,
      action,
      entityName,
      entityNameCasl,
      success,
      {
        ...context,
        additionalContext: {
          type: 'permission_check',
          ...context,
        },
      },
    );
  }

  // ============================================================================
  // 📊 MÉTODOS PÚBLICOS - MÉTRICAS E ANÁLISE
  // ============================================================================

  /**
   * Obtém métricas universais com filtros opcionais
   */
  obterMetricas(
    periodo?: { inicio: Date; fim: Date },
    filtros?: AuditFilters,
  ): UniversalMetrics {
    let logs = this.filtrarLogs(this.auditLogs, periodo, filtros);

    const totalRequests = logs.length;
    const successfulRequests = logs.filter(log => log.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      successRate,
      mostRequestedByEntity: this.calcularTopOperacoesPorEntidade(logs, true),
      mostDeniedByEntity: this.calcularTopOperacoesPorEntidade(logs, false),
      requestsByRole: this.agruparPor(logs, 'userRole'),
      requestsByCompany: this.agruparPorCompany(logs),
      requestsByEntity: this.agruparPor(logs, 'entityName'),
      requestsByAction: this.agruparPor(logs, 'action'),
      ...(periodo && {
        requestsByHour: this.agruparPorTempo(logs, 'hour'),
        requestsByDay: this.agruparPorTempo(logs, 'day'),
      }),
    };
  }

  /**
   * Obtém logs com filtros avançados
   */
  obterLogs(
    filtros?: AuditFilters,
    limite: number = 1000,
    periodo?: { inicio: Date; fim: Date },
  ): UniversalAuditLog[] {
    const logs = this.filtrarLogs(this.auditLogs, periodo, filtros);
    
    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limite);
  }

  /**
   * Obtém logs específicos de uma entidade
   */
  obterLogsPorEntidade(
    entityName: EntityNameModel,
    limite: number = 1000,
    periodo?: { inicio: Date; fim: Date },
  ): UniversalAuditLog[] {
    return this.obterLogs(
      { entityName },
      limite,
      periodo,
    );
  }

  /**
   * Obtém logs de falhas/erros
   */
  obterLogsFalhas(
    limite: number = 500,
    periodo?: { inicio: Date; fim: Date },
  ): UniversalAuditLog[] {
    return this.obterLogs(
      { success: false },
      limite,
      periodo,
    );
  }

  /**
   * Exporta logs em diferentes formatos
   */
  exportarLogs(
    formato: 'json' | 'csv' = 'json',
    filtros?: AuditFilters,
    periodo?: { inicio: Date; fim: Date },
  ): string {
    const logs = this.filtrarLogs(this.auditLogs, periodo, filtros);

    if (formato === 'csv') {
      return this.converterParaCSV(logs);
    }

    return JSON.stringify(logs, null, 2);
  }

  // ============================================================================
  // 🔧 MÉTODOS PRIVADOS - UTILITÁRIOS INTERNOS
  // ============================================================================

  private adicionarLog(log: UniversalAuditLog): void {
    this.auditLogs.push(log);

    // Limita o tamanho do array para evitar problemas de memória
    if (this.auditLogs.length > this.MAX_LOGS) {
      this.auditLogs = this.auditLogs.slice(-this.MAX_LOGS + 1000); // Remove os mais antigos
    }
  }

  private filtrarLogs(
    logs: UniversalAuditLog[],
    periodo?: { inicio: Date; fim: Date },
    filtros?: AuditFilters,
  ): UniversalAuditLog[] {
    let filteredLogs = logs;

    // Filtro por período
    if (periodo) {
      filteredLogs = filteredLogs.filter(
        log => log.timestamp >= periodo.inicio && log.timestamp <= periodo.fim,
      );
    }

    if (!filtros) return filteredLogs;

    // Aplicar filtros
    if (filtros.entityName) {
      const entities = Array.isArray(filtros.entityName) ? filtros.entityName : [filtros.entityName];
      filteredLogs = filteredLogs.filter(log => entities.includes(log.entityName));
    }

    if (filtros.userId) {
      const userIds = Array.isArray(filtros.userId) ? filtros.userId : [filtros.userId];
      filteredLogs = filteredLogs.filter(log => userIds.includes(log.userId));
    }

    if (filtros.action) {
      const actions = Array.isArray(filtros.action) ? filtros.action : [filtros.action];
      filteredLogs = filteredLogs.filter(log => actions.includes(log.action));
    }

    if (filtros.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filtros.success);
    }

    if (filtros.companyId) {
      const companyIds = Array.isArray(filtros.companyId) ? filtros.companyId : [filtros.companyId];
      filteredLogs = filteredLogs.filter(log => 
        log.userCompanyId && companyIds.includes(log.userCompanyId) ||
        log.relatedIds?.companyId && companyIds.includes(log.relatedIds.companyId)
      );
    }

    if (filtros.searchText) {
      const searchLower = filtros.searchText.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.errorMessage?.toLowerCase().includes(searchLower) ||
        JSON.stringify(log.context || {}).toLowerCase().includes(searchLower)
      );
    }

    return filteredLogs;
  }

  private calcularTopOperacoesPorEntidade(
    logs: UniversalAuditLog[],
    success: boolean,
  ): Array<{ entityName: string; action: string; count: number; errorMessage?: string }> {
    const filtered = logs.filter(log => log.success === success);
    const counts = new Map<string, { count: number; errorMessage?: string }>();

    filtered.forEach(log => {
      const key = `${log.entityName}:${log.action}`;
      const existing = counts.get(key) || { count: 0 };
      counts.set(key, {
        count: existing.count + 1,
        errorMessage: !success ? log.errorMessage : undefined,
      });
    });

    return Array.from(counts.entries())
      .map(([key, data]) => {
        const [entityName, action] = key.split(':');
        return { entityName, action, count: data.count, errorMessage: data.errorMessage };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }

  private agruparPor(logs: UniversalAuditLog[], campo: keyof UniversalAuditLog): Record<string, number> {
    const groups: Record<string, number> = {};
    logs.forEach(log => {
      const value = String(log[campo] || 'unknown');
      groups[value] = (groups[value] || 0) + 1;
    });
    return groups;
  }

  private agruparPorCompany(logs: UniversalAuditLog[]): Record<string, number> {
    const groups: Record<string, number> = {};
    logs.forEach(log => {
      const companyId = log.userCompanyId || log.relatedIds?.companyId || 'unknown';
      groups[companyId] = (groups[companyId] || 0) + 1;
    });
    return groups;
  }

  private agruparPorTempo(logs: UniversalAuditLog[], granularidade: 'hour' | 'day'): Record<string, number> {
    const groups: Record<string, number> = {};
    
    logs.forEach(log => {
      let key: string;
      if (granularidade === 'hour') {
        key = log.timestamp.toISOString().substring(0, 13); // YYYY-MM-DDTHH
      } else {
        key = log.timestamp.toISOString().substring(0, 10); // YYYY-MM-DD
      }
      groups[key] = (groups[key] || 0) + 1;
    });
    
    return groups;
  }

  private converterParaCSV(logs: UniversalAuditLog[]): string {
    if (logs.length === 0) return '';

    const headers = [
      'timestamp',
      'userId',
      'userRole',
      'userCompanyId',
      'action',
      'entityName',
      'entityNameCasl',
      'resourceId',
      'success',
      'errorMessage',
      'ipAddress',
      'userAgent',
    ];

    const csvContent = [
      headers.join(','),
      ...logs.map(log =>
        headers
          .map(header => {
            let value = log[header as keyof UniversalAuditLog];
            if (header === 'timestamp' && value) {
              value = (value as Date).toISOString();
            }
            return `"${String(value || '').replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    return csvContent.join('\n');
  }

  private getModelNameFromCasl(caslName: EntityNameCasl): EntityNameModel {
    // Mapear de CASL para Model name - pode usar o mapeamento do types.ts
    const mapping: Record<EntityNameCasl, EntityNameModel> = {
      'User': 'user',
      'Company': 'company',
      'Post': 'post',
      'Vehicle': 'vehicle',
      'Shift': 'shift',
      'Round': 'round',
      'Occurrence': 'occurrence',
    };
    
    return mapping[caslName] || 'unknown' as EntityNameModel;
  }

  // ============================================================================
  // 🧹 MÉTODOS PÚBLICOS - MANUTENÇÃO
  // ============================================================================

  /**
   * Limpa logs antigos (para evitar acúmulo em memória)
   */
  limparLogsAntigos(diasParaManter: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - diasParaManter);

    const countAntes = this.auditLogs.length;
    this.auditLogs = this.auditLogs.filter(log => log.timestamp >= cutoffDate);
    const removidos = countAntes - this.auditLogs.length;

    if (removidos > 0) {
      this.logger.log(`Removidos ${removidos} logs antigos (mais de ${diasParaManter} dias)`);
    }

    return removidos;
  }

  /**
   * Obtém estatísticas gerais do sistema de auditoria
   */
  obterEstatisticasDoSistema(): {
    totalLogsArmazenados: number;
    limiteMaximo: number;
    percentualOcupacao: number;
    logMaisAntigo?: Date;
    logMaisRecente?: Date;
  } {
    const totalLogs = this.auditLogs.length;
    
    return {
      totalLogsArmazenados: totalLogs,
      limiteMaximo: this.MAX_LOGS,
      percentualOcupacao: (totalLogs / this.MAX_LOGS) * 100,
      logMaisAntigo: totalLogs > 0 ? this.auditLogs[0].timestamp : undefined,
      logMaisRecente: totalLogs > 0 ? this.auditLogs[totalLogs - 1].timestamp : undefined,
    };
  }
}