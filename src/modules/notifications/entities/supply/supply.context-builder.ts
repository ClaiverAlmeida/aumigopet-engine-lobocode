/**
 * 🔧 CONTEXT BUILDER - SUPPLY
 * 
 * Constrói contexto rico para notificações de abastecimentos.
 * Inclui dados relacionados como posto, veículo, usuário, etc.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NotificationContext } from '../../shared/notification.types';
import { DateFormatter } from '../../shared/date-formatter';

@Injectable()
export class SupplyContextBuilder {
  constructor(private prisma: PrismaService) {}

  /**
   * 📋 SUPPLY - Contexto para abastecimentos
   */
  async buildSupplyContext(supplyId: string, operation: string): Promise<NotificationContext> {
    const supply = await this.prisma.supply.findUnique({
      where: { id: supplyId },
      include: {
        post: { select: { name: true } },
        vehicle: { select: { plate: true, model: true } },
        user: { select: { name: true } }
      }
    });

    if (!supply) {
      throw new Error(`Supply não encontrado: ${supplyId}`);
    }

    return {
      userName: supply.user.name,
      postName: supply.post.name,
      time: DateFormatter.formatDateTime(new Date()),
      liters: supply.liters || 0,
      talaoNumber: supply.talaoNumber,
      vehiclePlate: supply.vehicle?.plate,
      vehicleModel: supply.vehicle?.model
    };
  }

}
