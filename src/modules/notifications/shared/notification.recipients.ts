import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { RecipientType, RecipientRule } from './notification.types';
import { Roles } from '@prisma/client';

/**
 * 👥 SISTEMA DE DESTINATÁRIOS DE NOTIFICAÇÃO FLEXÍVEL
 *
 * Gerencia quem deve receber cada tipo de notificação baseado em regras de negócio.
 * Suporta diferentes tipos de destinatários para diferentes cenários.
 */
@Injectable()
export class NotificationRecipientsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 🎯 OBTÉM DESTINATÁRIOS BASEADO NO TIPO E REGRAS
   */
  async getRecipients(
    companyId: string,
    recipientType: RecipientType,
    rule?: RecipientRule,
  ): Promise<string[]> {
    switch (recipientType) {
      case 'ALL':
        return this.getAllUsers(companyId);

      case 'ADMINS_ONLY':
        return this.getAdminsOnly(companyId);

      case 'SUPERVISORS_ONLY':
        return this.getSupervisorsOnly(companyId);

      case 'ADMINS_AND_SUPERVISORS':
        return this.getAdminsAndSupervisors(companyId);

      case 'ACTIVE_SUPERVISORS':
        return this.getActiveSupervisors(companyId);

      case 'ACTIVE_SUPERVISORS_AND_ADMINS':
        return this.getActiveSupervisorsAndAdmins(companyId);

      case 'ACTIVE_SUPERVISORS_AND_ADMINS_AND_HR':
        return this.getActiveSupervisorsAndAdminsAndHR(companyId);

      case 'HR_ONLY':
        return this.getHROnly(companyId);

      case 'HR_AND_ADMINS':
        return this.getHRAndAdmins(companyId);

      case 'GUARD_ONLY':
        return this.getGuardOnly(rule?.guardId);

      case 'GUARD_AND_SUPERVISORS':
        return this.getGuardAndSupervisors(companyId, rule?.guardId);

      case 'GUARD_AND_ADMINS':
        return this.getGuardAndAdmins(companyId, rule?.guardId);

      case 'GUARD_AND_ACTIVE_SUPERVISORS':
        return this.getGuardAndActiveSupervisors(companyId, rule?.guardId);

      case 'GUARD_AND_ACTIVE_SUPERVISORS_AND_ADMINS':
        return this.getGuardAndActiveSupervisorsAndAdmins(companyId, rule?.guardId);

      case 'SPECIFIC_USERS':
        return rule?.userIds || [];

      default:
        console.warn(`Tipo de destinatário não reconhecido: ${recipientType}`);
        return [];
    }
  }

  // ============================================================================
  // 🔧 MÉTODOS PRIVADOS PARA DIFERENTES TIPOS DE DESTINATÁRIOS
  // ============================================================================

  /**
   * 👥 TODOS OS USUÁRIOS DA EMPRESA
   */
  private async getAllUsers(companyId: string): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: {
        companyId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { id: true },
    });
    return users.map((user) => user.id);
  }

  /**
   * 👑 APENAS ADMINISTRADORES
   */
  private async getAdminsOnly(companyId: string): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: {
        companyId,
        role: 'ADMIN',
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { id: true },
    });
    return users.map((user) => user.id);
  }

  /**
   * 👨‍💼 APENAS ADMINS
   */
  private async getSupervisorsOnly(companyId: string): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: {
        companyId,
        role: Roles.ADMIN,
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { id: true },
    });
    return users.map((user) => user.id);
  }

  /**
   * 👑 ADMINISTRADORES
   */
  private async getAdminsAndSupervisors(companyId: string): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: {
        companyId,
        role: Roles.ADMIN,
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { id: true },
    });
    return users.map((user) => user.id);
  }

  /**
   * 🔄 ADMINS ATIVOS (substituindo supervisores em turno)
   */
  private async getActiveSupervisors(companyId: string): Promise<string[]> {
    // Como não temos mais turnos, retornamos apenas admins ativos
    return this.getAdminsOnly(companyId);
  }

  /**
   * 🔄👑 SUPERVISORES ATIVOS + ADMINISTRADORES
   */
  private async getActiveSupervisorsAndAdmins(
    companyId: string,
  ): Promise<string[]> {
    const [activeSupervisors, admins] = await Promise.all([
      this.getActiveSupervisors(companyId),
      this.getAdminsOnly(companyId),
    ]);
    return Array.from(new Set([...activeSupervisors, ...admins]));
  }

  /**
   * 🔄👑👔 SUPERVISORES ATIVOS + ADMINISTRADORES + RH
   */
  private async getActiveSupervisorsAndAdminsAndHR(
    companyId: string,
  ): Promise<string[]> {
    const [activeSupervisors, admins, hr] = await Promise.all([
      this.getActiveSupervisors(companyId),
      this.getAdminsOnly(companyId),
      this.getHROnly(companyId),
    ]);
    return Array.from(new Set([...activeSupervisors, ...admins, ...hr]));
  }

  /**
   * 👑 APENAS ADMINS (substituindo RH)
   */
  private async getHROnly(companyId: string): Promise<string[]> {
    return this.getAdminsOnly(companyId);
  }

  /**
   * 👑 ADMINISTRADORES (substituindo RH + Admins)
   */
  private async getHRAndAdmins(companyId: string): Promise<string[]> {
    return this.getAdminsOnly(companyId);
  }

  /**
   * 🛡️ APENAS GUARDA ESPECÍFICO
   */
  private async getGuardOnly(guardId?: string): Promise<string[]> {
    if (!guardId) return [];
    return [guardId];
  }

  /**
   * 🛡️👨‍💼 GUARDA + SUPERVISORES
   */
  private async getGuardAndSupervisors(
    companyId: string,
    guardId?: string,
  ): Promise<string[]> {
    const [guard, supervisors] = await Promise.all([
      this.getGuardOnly(guardId),
      this.getSupervisorsOnly(companyId),
    ]);
    return Array.from(new Set([...guard, ...supervisors]));
  }

  /**
   * 🛡️👑 GUARDA + ADMINISTRADORES
   */
  private async getGuardAndAdmins(
    companyId: string,
    guardId?: string,
  ): Promise<string[]> {
    const [guard, admins] = await Promise.all([
      this.getGuardOnly(guardId),
      this.getAdminsOnly(companyId),
    ]);
    return Array.from(new Set([...guard, ...admins]));
  }

  /**
   * 🛡️🔄 GUARDA + SUPERVISORES ATIVOS
   */
  private async getGuardAndActiveSupervisors(
    companyId: string,
    guardId?: string,
  ): Promise<string[]> {
    const [guard, activeSupervisors] = await Promise.all([
      this.getGuardOnly(guardId),
      this.getActiveSupervisors(companyId),
    ]);
    return Array.from(new Set([...guard, ...activeSupervisors]));
  }

  private async getGuardAndActiveSupervisorsAndAdmins(
    companyId: string,
    guardId?: string,
  ): Promise<string[]> {
    const [guard, activeSupervisors, admins] = await Promise.all([
      this.getGuardOnly(guardId),
      this.getActiveSupervisors(companyId),
      this.getAdminsOnly(companyId),
    ]);
    return Array.from(new Set([...guard, ...activeSupervisors, ...admins]));
  }

  // ============================================================================
  // 🔧 MÉTODOS DE COMPATIBILIDADE (MANTIDOS PARA NÃO QUEBRAR CÓDIGO EXISTENTE)
  // ============================================================================

  /**
   * @deprecated Use getRecipients com RecipientType
   */
  async getAllAdminsAndSupervisorsInCompany(
    companyId: string,
  ): Promise<string[]> {
    return this.getAdminsAndSupervisors(companyId);
  }
}
