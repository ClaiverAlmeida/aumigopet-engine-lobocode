/**
 * 🔔 HELPER GLOBAL DE NOTIFICAÇÕES - AUMIGOPET
 * 
 * Helper principal que delega para helpers específicos por entidade.
 * Versão simplificada mantendo apenas User.
 */

import { Injectable } from '@nestjs/common';
import { NotificationService } from './shared/notification.service';
import { NotificationRecipientsService } from './shared/notification.recipients';
import { CreateNotificationData } from './shared/notification.types';

// Import helpers específicos
import { UserNotificationHelper } from './entities/user';

@Injectable()
export class NotificationHelper {
  constructor(
    private notificationService: NotificationService,
    private recipientsService: NotificationRecipientsService,
    private userHelper: UserNotificationHelper,
  ) {}

  // ============================================================================
  // 👥 USERS - Delega para UserNotificationHelper
  // ============================================================================

  /**
   * Notifica criação de usuário
   */
  async userCriado(
    userId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.userHelper.userCriado(userId, criadoPorUserId, companyId);
  }

  /**
   * Notifica atualização de usuário
   */
  async userAtualizado(
    userId: string,
    atualizadoPorUserId: string,
    companyId: string,
  ) {
    return this.userHelper.userAtualizado(userId, atualizadoPorUserId, companyId);
  }

  /**
   * Notifica desativação de usuário
   */
  async userDesativado(
    userId: string,
    desativadoPorUserId: string,
    companyId: string,
  ) {
    return this.userHelper.userDesativado(userId, desativadoPorUserId, companyId);
  }

  // ============================================================================
  // 🔧 MÉTODOS AUXILIARES GENÉRICOS
  // ============================================================================

  /**
   * Cria notificação genérica
   */
  async criar(data: CreateNotificationData) {
    return this.notificationService.criar(data);
  }

  /**
   * Marca notificação como lida
   */
  async marcarComoLida(notificationId: string, userId: string) {
    return this.notificationService.marcarComoLida(notificationId, userId);
  }

  /**
   * Marca todas notificações de um usuário como lidas
   */
  async marcarTodasComoLidas(userId: string) {
    return this.notificationService.marcarTodasComoLidas(userId);
  }

  /**
   * Busca notificações não lidas de um usuário
   */
  async buscarNaoLidas(userId: string) {
    return this.notificationService.buscarDoUsuario(userId, { isRead: false });
  }

  /**
   * Busca todas notificações de um usuário
   */
  async buscarTodas(userId: string, page = 1, limit = 20) {
    return this.notificationService.buscarDoUsuario(userId, { page, limit });
  }

  // ============================================================================
  // 📝 TODO: Adicionar helpers de novas entidades do AUMIGOPET
  // ============================================================================
  
  // async petCriado(petId: string, criadoPorUserId: string, companyId: string): Promise<void>
  // async vaccineRegistered(vaccineId: string, petId: string, userId: string): Promise<void>
  // async reminderCreated(reminderId: string, userId: string): Promise<void>
  // etc...
}
