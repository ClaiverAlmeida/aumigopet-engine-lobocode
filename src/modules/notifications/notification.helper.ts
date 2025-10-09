/**
 * 🔔 HELPER GLOBAL DE NOTIFICAÇÕES - VERSÃO MODULAR
 * 
 * Helper principal que delega para helpers específicos por entidade.
 * Mantém compatibilidade com código existente.
 */

import { Injectable } from '@nestjs/common';
import { NotificationService } from './shared/notification.service';
import { NotificationRecipientsService } from './shared/notification.recipients';
import { CreateNotificationData } from './shared/notification.types';

// Import helpers específicos
import { SupplyNotificationHelper } from './entities/supply';
import { ShiftNotificationHelper } from './entities/shift';
import { OccurrenceNotificationHelper } from './entities/occurrence';
import { VehicleChecklistNotificationHelper } from './entities/vehicle-checklist';
import { UserNotificationHelper } from './entities/user';
import { DoormanChecklistNotificationHelper } from './entities/doorman-checklist';
import { MotorcycleChecklistNotificationHelper } from './entities/motorcycle-checklist';
import { MotorizedServiceNotificationHelper } from './entities/motorized-service';
import { OccurrenceDispatchNotificationHelper } from './entities/occurrence-dispatch';

@Injectable()
export class NotificationHelper {
  constructor(
    private notificationService: NotificationService,
    private recipientsService: NotificationRecipientsService,
    private supplyHelper: SupplyNotificationHelper,
    private shiftHelper: ShiftNotificationHelper,
    private occurrenceHelper: OccurrenceNotificationHelper,
    private vehicleChecklistHelper: VehicleChecklistNotificationHelper,
    private userHelper: UserNotificationHelper,
    private doormanChecklistHelper: DoormanChecklistNotificationHelper,
    private motorcycleChecklistHelper: MotorcycleChecklistNotificationHelper,
    private motorizedServiceHelper: MotorizedServiceNotificationHelper,
    private occurrenceDispatchHelper: OccurrenceDispatchNotificationHelper
  ) {}

  // ============================================================================
  // 🚀 MÉTODOS DELEGADOS PARA HELPERS ESPECÍFICOS
  // ============================================================================

  /**
   * 📋 SUPPLIES - Delega para SupplyNotificationHelper
   */
  async supplyCriado(
    supplyId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.supplyHelper.supplyCriado(supplyId, criadoPorUserId, companyId);
  }

  async supplyAtualizado(
    supplyId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.supplyHelper.supplyAtualizado(supplyId, criadoPorUserId, companyId);
  }

  async supplyFinalizado(
    supplyId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.supplyHelper.supplyFinalizado(supplyId, criadoPorUserId, companyId);
  }

  /**
   * 🕐 SHIFTS - Delega para ShiftNotificationHelper
   */
  async turnoIniciado(
    turnoId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.shiftHelper.turnoIniciado(turnoId, criadoPorUserId, companyId);
  }

  async turnoFinalizado(
    turnoId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.shiftHelper.turnoFinalizado(turnoId, criadoPorUserId, companyId);
  }

  async turnoEmIntervalo(
    turnoId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.shiftHelper.turnoEmIntervalo(turnoId, criadoPorUserId, companyId);
  }

  async intervaloFinalizado(
    turnoId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.shiftHelper.intervaloFinalizado(turnoId, criadoPorUserId, companyId);
  }

  // ============================================================================
  // 🔧 MÉTODOS GENÉRICOS (MANTIDOS PARA COMPATIBILIDADE)
  // ============================================================================

  /**
   * 🚨 OCCURRENCES - Delega para OccurrenceNotificationHelper
   */
  async ocorrenciaCriada(
    ocorrenciaId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.occurrenceHelper.occurrenceCriada(ocorrenciaId, criadoPorUserId, companyId);
  }

  async ocorrenciaAtualizada(
    ocorrenciaId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.occurrenceHelper.occurrenceAtualizada(ocorrenciaId, criadoPorUserId, companyId);
  }

  async ocorrenciaResolvida(
    ocorrenciaId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.occurrenceHelper.occurrenceResolvida(ocorrenciaId, criadoPorUserId, companyId);
  }

  /**
   * 🚗 VEHICLE CHECKLISTS - Delega para VehicleChecklistNotificationHelper
   */
  async checklistVeiculoCriado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.vehicleChecklistHelper.vehicleChecklistCriado(checklistId, criadoPorUserId, companyId);
  }

  async checklistVeiculoAtualizado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.vehicleChecklistHelper.vehicleChecklistAtualizado(checklistId, criadoPorUserId, companyId);
  }

  async checklistVeiculoFinalizado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.vehicleChecklistHelper.vehicleChecklistFinalizado(checklistId, criadoPorUserId, companyId);
  }

  /**
   * 👥 USERS - Delega para UserNotificationHelper
   */
  async usuarioCriado(
    userId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.userHelper.userCriado(userId, criadoPorUserId, companyId);
  }

  async usuarioAtualizado(
    userId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.userHelper.userAtualizado(userId, criadoPorUserId, companyId);
  }

  async usuarioDesativado(
    userId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.userHelper.userDesativado(userId, criadoPorUserId, companyId);
  }

  /**
   * 🚪 DOORMAN CHECKLISTS - Delega para DoormanChecklistNotificationHelper
   */
  async checklistPorteiroCriado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.doormanChecklistHelper.doormanChecklistCriado(checklistId, criadoPorUserId, companyId);
  }

  async checklistPorteiroAtualizado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.doormanChecklistHelper.doormanChecklistAtualizado(checklistId, criadoPorUserId, companyId);
  }

  async checklistPorteiroFinalizado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.doormanChecklistHelper.doormanChecklistFinalizado(checklistId, criadoPorUserId, companyId);
  }

  /**
   * 🏍️ MOTORCYCLE CHECKLISTS - Delega para MotorcycleChecklistNotificationHelper
   */
  async checklistMotocicletaCriado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.motorcycleChecklistHelper.motorcycleChecklistCriado(checklistId, criadoPorUserId, companyId);
  }

  async checklistMotocicletaAtualizado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.motorcycleChecklistHelper.motorcycleChecklistAtualizado(checklistId, criadoPorUserId, companyId);
  }

  async checklistMotocicletaFinalizado(
    checklistId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.motorcycleChecklistHelper.motorcycleChecklistFinalizado(checklistId, criadoPorUserId, companyId);
  }

  /**
   * 🚛 MOTORIZED SERVICES - Delega para MotorizedServiceNotificationHelper
   */
  async servicoMotorizadoCriado(
    serviceId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.motorizedServiceHelper.motorizedServiceCriado(serviceId, criadoPorUserId, companyId);
  }

  async servicoMotorizadoAtualizado(
    serviceId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.motorizedServiceHelper.motorizedServiceAtualizado(serviceId, criadoPorUserId, companyId);
  }

  async servicoMotorizadoFinalizado(
    serviceId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.motorizedServiceHelper.motorizedServiceFinalizado(serviceId, criadoPorUserId, companyId);
  }

  /**
   * 🚨 OCCURRENCE DISPATCHES - Delega para OccurrenceDispatchNotificationHelper
   */
  async despachoOcorrenciaCriado(
    dispatchId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.occurrenceDispatchHelper.occurrenceDispatchCriado(dispatchId, criadoPorUserId, companyId);
  }

  async despachoOcorrenciaAtualizado(
    dispatchId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.occurrenceDispatchHelper.occurrenceDispatchAtualizado(dispatchId, criadoPorUserId, companyId);
  }

  async despachoOcorrenciaFinalizado(
    dispatchId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    return this.occurrenceDispatchHelper.occurrenceDispatchFinalizado(dispatchId, criadoPorUserId, companyId);
  }

  // ============================================================================
  // 🔧 MÉTODOS GENÉRICOS E UTILITÁRIOS
  // ============================================================================

  /**
   * Notificação genérica para qualquer entidade
   */
  async entidadeCriada(
    entityType: string,
    entityId: string,
    titulo: string,
    criadoPorUserId: string,
    companyId?: string,
  ) {
    return this.notificationService.criar({
      title: `Novo(a) ${entityType} criado(a)`,
      message: titulo,
      entityType,
      entityId,
      userId: criadoPorUserId,
      companyId,
    });
  }

  /**
   * Notificação genérica para atualização
   */
  async entidadeAtualizada(
    entityType: string,
    entityId: string,
    titulo: string,
    criadoPorUserId: string,
    companyId?: string,
  ) {
    return this.notificationService.criar({
      title: `${entityType} atualizado(a)`,
      message: titulo,
      entityType,
      entityId,
      userId: criadoPorUserId,
      companyId,
    });
  }

  /**
   * Método genérico para qualquer notificação
   */
  async notificar(
    titulo: string,
    mensagem: string,
    criadoPorUserId: string,
    companyId?: string,
    entityType?: string,
    entityId?: string,
  ) {
    return this.notificationService.criar({
      title: titulo,
      message: mensagem,
      entityType,
      entityId,
      userId: criadoPorUserId,
      companyId,
    });
  }

  /**
   * Notificar usuários específicos
   */
  async notificarUsuarios(
    userIds: string[],
    titulo: string,
    mensagem: string,
    entityType: string,
    entityId: string,
    criadoPorUserId: string,
    companyId?: string,
  ) {
    // Para usuários específicos, precisamos criar notificações individuais
    const promises = userIds.map(userId => 
      this.notificationService.criar({
        title: titulo,
        message: mensagem,
        entityType,
        entityId,
        userId: criadoPorUserId,
        companyId,
      })
    );

    return Promise.all(promises);
  }
}