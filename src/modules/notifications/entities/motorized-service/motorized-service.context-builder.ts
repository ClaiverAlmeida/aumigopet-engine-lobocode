/**
 * 🔧 CONTEXT BUILDER - MOTORIZED SERVICE
 * 
 * Constrói contexto rico para notificações de serviços motorizados.
 * Inclui dados relacionados como posto, usuário, etc.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NotificationContext } from '../../shared/notification.types';
import { DateFormatter } from '../../shared/date-formatter';

@Injectable()
export class MotorizedServiceContextBuilder {
  constructor(private prisma: PrismaService) {}

  /**
   * 🚛 MOTORIZED SERVICE - Contexto para serviços motorizados
   */
  async buildMotorizedServiceContext(serviceId: string, operation: string): Promise<NotificationContext> {
    const service = await this.prisma.motorizedService.findUnique({
      where: { id: serviceId },
      include: {
        user: { select: { name: true } },
        shift: { 
          include: { 
            post: { select: { name: true } } 
          } 
        }
      }
    });

    if (!service) {
      throw new Error(`MotorizedService não encontrado: ${serviceId}`);
    }

    return {
      userName: service.userName,
      postName: service.shift?.post?.name ? ` no posto ${service.shift.post.name}` : '',
      time: DateFormatter.formatDateTime(new Date()),
    };
  }
}
