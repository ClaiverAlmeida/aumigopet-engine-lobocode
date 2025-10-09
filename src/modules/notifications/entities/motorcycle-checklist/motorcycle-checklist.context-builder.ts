/**
 * 🔧 CONTEXT BUILDER - MOTORCYCLE CHECKLIST
 * 
 * Constrói contexto rico para notificações de checklist de motocicletas.
 * Inclui dados relacionados como posto, motocicleta, usuário, etc.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NotificationContext } from '../../shared/notification.types';
import { DateFormatter } from '../../shared/date-formatter';

@Injectable()
export class MotorcycleChecklistContextBuilder {
  constructor(private prisma: PrismaService) {}

  /**
   * 🏍️ MOTORCYCLE CHECKLIST - Contexto para checklist de motocicletas
   */
  async buildMotorcycleChecklistContext(checklistId: string, operation: string): Promise<NotificationContext> {
    const checklist = await this.prisma.motorcycleChecklist.findUnique({
      where: { id: checklistId },
      include: {
        motorcycle: { select: { plate: true, model: true } },
        user: { select: { name: true } },
        shift: { 
          include: { 
            post: { select: { name: true } } 
          } 
        }
      }
    });

    if (!checklist) {
      throw new Error(`MotorcycleChecklist não encontrado: ${checklistId}`);
    }

    return {
      userName: checklist.userName,
      postName: checklist.shift?.post?.name ? ` no posto ${checklist.shift.post.name}` : '',
      time: DateFormatter.formatDateTime(new Date()),
      vehiclePlate: checklist.motorcycle?.plate,
      vehicleModel: checklist.motorcycle?.model
    };
  }
}
