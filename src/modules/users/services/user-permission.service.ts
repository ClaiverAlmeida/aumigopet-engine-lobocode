import { Injectable } from '@nestjs/common';
import { CaslAbilityService } from '../../../shared/casl/casl-ability/casl-ability.service';
import { TenantService } from '../../../shared/tenant/tenant.service';
import { Roles } from '@prisma/client';
import { ForbiddenError } from 'src/shared/common/errors';
import { ERROR_MESSAGES } from 'src/shared/common/messages';
import { CrudAction } from '../../../shared/common/types';

@Injectable()
export class UserPermissionService {
  constructor(
    private abilityService: CaslAbilityService,
    private tenantService: TenantService,
  ) {}

  // ============================================================================
  // 🔐 MÉTODOS PÚBLICOS - VALIDAÇÃO DE PERMISSÕES BÁSICAS
  // ============================================================================

  /**
   * Verifica se o usuário pode realizar uma ação específica
   */
  validarAction(action: CrudAction): boolean {
    const ability = this.abilityService.ability;

    if (!ability.can(action, 'User')) {
      throw new ForbiddenError(
        ERROR_MESSAGES.AUTHORIZATION.RESOURCE_ACCESS_DENIED,
      );
    }

    return true;
  }

  // ============================================================================
  // 🎯 MÉTODOS PÚBLICOS - VALIDAÇÃO DE ROLE POR AÇÃO
  // ============================================================================

  /**
   * Verifica se pode criar usuário com role específico
   */
  validarCriacaoDeUserComRole(targetRole: Roles): boolean {
    return this.validarPermissaoDeRole('create', targetRole);
  }

  /**
   * Verifica se pode atualizar usuário com role específico
   */
  validarAtualizacaoDeUserComRole(targetRole: Roles): boolean {
    return this.validarPermissaoDeRole('update', targetRole);
  }

  /**
   * Verifica se pode deletar usuário com role específico
   */
  validarDelecaoDeUserComRole(targetRole: Roles): boolean {
    return this.validarPermissaoDeRole('delete', targetRole);
  }

  /**
   * Validação centralizada para qualquer ação CRUD com role específico
   */
  validarAcaoDeUserComRole(action: CrudAction, targetRole: Roles): boolean {
    return this.validarPermissaoDeRole(action, targetRole);
  }

  // ============================================================================
  // 📝 MÉTODOS PÚBLICOS - VALIDAÇÃO DE CAMPOS
  // ============================================================================

  /**
   * Valida permissões para atualização de campos específicos
   */
  validarPermissoesDeCampo(updateData: any): boolean {
    const ability = this.abilityService.ability;

    // Verifica se tem permissão geral para update
    const canUpdateGeneral = ability.can('update', 'User');
    if (!canUpdateGeneral) {
      throw new ForbiddenError(
        ERROR_MESSAGES.AUTHORIZATION.RESOURCE_ACCESS_DENIED,
      );
    }

    const updateRules = ability.rulesFor('update', 'User');

    // VALIDAÇÃO GRANULAR: Verificar cada campo individualmente
    const fieldsToUpdate = Object.keys(updateData);

    // Se não há campos para atualizar, retorna true
    if (fieldsToUpdate.length === 0) {
      return true;
    }

    // Analisa as regras CASL para entender permissões por campo
    const allowedFields = this.extrairCamposPermitidosDasRules(updateRules);

    // Verifica cada campo específico
    for (const field of fieldsToUpdate) {
      let canUpdateField = false;

      // Se temos campos específicos definidos nas regras, verifica se o campo está permitido
      if (allowedFields.length > 0) {
        canUpdateField =
          allowedFields.includes(field) || allowedFields.includes('*');
      } else {
        // Se não há campos específicos, usa permissão geral
        canUpdateField = canUpdateGeneral;
      }

      if (!canUpdateField) {
        throw new ForbiddenError(
          ERROR_MESSAGES.AUTHORIZATION.RESOURCE_ACCESS_DENIED,
        );
      }
    }
    return true;
  }

  // ============================================================================
  // 🔧 MÉTODOS PRIVADOS - LÓGICA CENTRALIZADA
  // ============================================================================

  /**
   * Extrai campos permitidos das regras CASL
   */
  private extrairCamposPermitidosDasRules(rules: any[]): string[] {
    const allowedFields: string[] = [];

    for (const rule of rules) {
      // Se a regra tem campos específicos definidos
      if (rule.fields) {
        if (Array.isArray(rule.fields)) {
          allowedFields.push(...rule.fields);
        } else if (typeof rule.fields === 'string') {
          allowedFields.push(rule.fields);
        }
      }

      // Se a regra é 'manage all', permite todos os campos
      if (rule.action === 'manage' && rule.subject === 'all') {
        allowedFields.push('*');
      }
    }

    return Array.from(new Set(allowedFields)); // Remove duplicatas
  }

  /**
   * Valida se o usuário pode realizar ação específica com determinado role
   * Usa regras CASL para verificar permissões hierárquicas
   */
  private validarPermissaoDeRole(
    action: CrudAction,
    targetRole: Roles,
  ): boolean {
    const ability = this.abilityService.ability;

    // Se o usuário tem permissão 'manage all' (SYSTEM_ADMIN), pode realizar qualquer ação
    // independente do tenant (global ou específico)
    if (ability.can('manage', 'all')) {
      return true;
    }

    try {
      const rules = ability.rulesFor(action, 'User');

      for (const rule of rules as any[]) {
        if (rule.conditions?.role?.in) {
          if (rule.conditions.role.in.includes(targetRole)) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      throw new ForbiddenError(
        ERROR_MESSAGES.AUTHORIZATION.RESOURCE_ACCESS_DENIED,
      );
    }
  }
}
