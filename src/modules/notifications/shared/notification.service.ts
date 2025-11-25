import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  CreateNotificationData,
  NotificationResponse,
  NotificationFilters,
} from './notification.types';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private notificationGateway: NotificationGateway,
  ) {}

  // ============================================================================
  // 📢 CRIAR NOTIFICAÇÃO
  // ============================================================================

  /**
   * Criar uma notificação simples
   */
  async criar(data: CreateNotificationData): Promise<NotificationResponse | null> {
    // 1. Determinar destinatários (usar os passados ou calcular automaticamente)
    let targetUserIds =
      data.recipients && data.recipients.length > 0
        ? data.recipients
        : await this.obterDestinatarios(data.companyId);

    // 2. Excluir o criador da notificação dos destinatários
    targetUserIds = targetUserIds.filter(userId => userId !== data.userId);

    // 3. Se não há destinatários após filtrar, não criar notificação
    if (targetUserIds.length === 0) {
      return null;
    }

    // 4. Criar a notificação no banco
    const notification = await this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        entityType: data.entityType,
        entityId: data.entityId,
        createdByUserId: data.userId,
        companyId: data.companyId,
      },
    });

    // 5. Criar registros para cada destinatário
    await this.criarNotificacaoParaUsuarios(notification.id, targetUserIds);

    // 6. Preparar resposta
    const notificationResponse = {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      entityType: notification.entityType || undefined,
      entityId: notification.entityId || undefined,
      isRead: false,
      createdAt: notification.createdAt,
    };

    // 7. Enviar notificação em tempo real para usuários conectados
    await this.enviarNotificacaoTempoReal(
      notificationResponse,
      targetUserIds,
      data.companyId,
    );

    return notificationResponse;
  }

  // ============================================================================
  // 📋 BUSCAR NOTIFICAÇÕES DO USUÁRIO
  // ============================================================================

  /**
   * Buscar notificações de um usuário
   */
  async buscarDoUsuario(
    userId: string,
    filters: NotificationFilters = {},
  ): Promise<{ notifications: NotificationResponse[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      recipients: {
        some: {
          userId,
          ...(filters.isRead !== undefined && { isRead: filters.isRead }),
        },
      },
      ...(filters.entityType && { entityType: filters.entityType }),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          recipients: {
            where: { userId },
            select: { isRead: true },
          },
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        entityType: n.entityType || undefined,
        entityId: n.entityId || undefined,
        isRead: n.recipients[0]?.isRead || false,
        createdAt: n.createdAt,
      })),
      total,
    };
  }

  /**
   * Contar notificações não lidas
   */
  async contarNaoLidas(userId: string): Promise<number> {
    return this.prisma.notificationRecipient.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Marcar notificação como lida
   */
  async marcarComoLida(notificationId: string, userId: string): Promise<void> {
    // Verificar se a notificação pertence ao usuário
    const notificationRecipient = await this.prisma.notificationRecipient.findFirst({
      where: {
        notificationId,
        userId,
      },
    });

    if (!notificationRecipient) {
      throw new NotFoundException('Notificação não encontrada ou não pertence ao usuário');
    }

    await this.prisma.notificationRecipient.updateMany({
      where: {
        notificationId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Marcar todas as notificações como lidas
   */
  async marcarTodasComoLidas(userId: string): Promise<void> {
    await this.prisma.notificationRecipient.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Deletar notificação (apenas para o usuário específico)
   */
  async deletarNotificacao(notificationId: string, userId: string): Promise<void> {
    // Verificar se a notificação pertence ao usuário
    const notificationRecipient = await this.prisma.notificationRecipient.findFirst({
      where: {
        notificationId,
        userId,
      },
    });

    if (!notificationRecipient) {
      throw new NotFoundException('Notificação não encontrada ou não pertence ao usuário');
    }

    // Deletar apenas o registro do usuário específico
    await this.prisma.notificationRecipient.delete({
      where: {
        id: notificationRecipient.id,
      },
    });
  }

  // ============================================================================
  // 🔧 MÉTODOS PRIVADOS
  // ============================================================================

  /**
   * Obter destinatários (managers e supervisors da empresa)
   */
  private async obterDestinatarios(companyId?: string): Promise<string[]> {
    const where: any = {
      role: { in: ['ADMIN', 'SUPERVISOR'] },
      deletedAt: null,
    };

    if (companyId) {
      where.companyId = companyId;
    }

    const users = await this.prisma.user.findMany({
      where,
      select: { id: true },
    });

    return users.map((user) => user.id);
  }

  /**
   * Criar registros de notificação para usuários
   */
  private async criarNotificacaoParaUsuarios(
    notificationId: string,
    userIds: string[],
  ): Promise<void> {
    if (userIds.length === 0) return;

    await this.prisma.notificationRecipient.createMany({
      data: userIds.map((userId) => ({
        notificationId,
        userId,
        isRead: false,
      })),
    });
  }

  // ============================================================================
  // 🔔 NOTIFICAÇÕES EM TEMPO REAL
  // ============================================================================

  /**
   * Enviar notificação em tempo real para usuários conectados
   */
  private async enviarNotificacaoTempoReal(
    notification: NotificationResponse,
    targetUserIds: string[],
    companyId?: string,
  ): Promise<void> {
    try {
      // Enviar para usuários específicos
      await this.notificationGateway.enviarParaUsuarios(
        targetUserIds,
        notification,
      );

      // Enviar para sala da empresa (se existir)
      if (companyId) {
        await this.notificationGateway.enviarParaSala(
          `company_${companyId}`,
          notification,
        );
      }

      // Atualizar contadores de não lidas para todos os destinatários
      for (const userId of targetUserIds) {
        await this.notificationGateway.atualizarContadorNaoLidas(userId);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação em tempo real:', error);
    }
  }

  /**
   * Enviar notificação em tempo real para usuário específico
   */
  async enviarNotificacaoTempoRealParaUsuario(
    userId: string,
    notification: NotificationResponse,
  ): Promise<void> {
    await this.notificationGateway.enviarParaUsuario(userId, notification);
    await this.notificationGateway.atualizarContadorNaoLidas(userId);
  }

  /**
   * Enviar notificação em tempo real para sala específica
   */
  async enviarNotificacaoTempoRealParaSala(
    room: string,
    notification: NotificationResponse,
  ): Promise<void> {
    await this.notificationGateway.enviarParaSala(room, notification);
  }
}
