/**
 * 🔧 CONTEXT BUILDER - OCCURRENCE DISPATCH
 * 
 * Constrói contexto rico para notificações de despacho de ocorrências.
 * Inclui dados relacionados como posto, usuário, etc.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NotificationContext } from '../../shared/notification.types';
import { DateFormatter } from '../../shared/date-formatter';

@Injectable()
export class OccurrenceDispatchContextBuilder {
  constructor(private prisma: PrismaService) {}

  /**
   * 🚨 OCCURRENCE DISPATCH - Contexto para despacho de ocorrências
   */
  async buildOccurrenceDispatchContext(dispatchId: string, operation: string): Promise<NotificationContext> {
    const dispatch = await this.prisma.occurrenceDispatch.findUnique({
      where: { id: dispatchId },
      include: {
        user: { select: { name: true } },
        shift: { 
          include: { 
            post: { select: { name: true } } 
          } 
        },
        guard: { select: { name: true } } // Buscar dados do guarda
      }
    });

    if (!dispatch) {
      throw new Error(`OccurrenceDispatch não encontrado: ${dispatchId}`);
    }

    return {
      userName: dispatch.userName,
      postName: dispatch.shift?.post?.name ? ` no posto ${dispatch.shift.post.name}` : '',
      time: DateFormatter.formatDateTime(new Date()),
      guardId: dispatch.guardId || undefined,
      guardName: dispatch.guard?.name || 'Vigilante não identificado', // Nome do guarda
    };
  }
}
