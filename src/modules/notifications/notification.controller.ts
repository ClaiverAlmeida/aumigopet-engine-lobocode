import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './shared/notification.service';
import { AuthGuard } from '../../shared/auth/guards/auth.guard';
import { NotificationFilters } from './shared/notification.types';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  /**
   * Buscar minhas notificações
   * GET /notifications?page=1&limit=20&isRead=false
   */
  @Get()
  async minhasNotificacoes(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isRead') isRead?: string,
    @Query('entityType') entityType?: string,
  ) {
    const userId = req.user.id;

    const filters: NotificationFilters = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 1000,
      ...(isRead !== undefined && { isRead: isRead === 'true' }),
      ...(entityType && { entityType }),
    };

    return this.notificationService.buscarDoUsuario(userId, filters);
  }

  /**
   * Contar não lidas
   * GET /notifications/unread-count
   */
  @Get('unread-count')
  async contarNaoLidas(@Request() req: any) {
    const userId = req.user.id;
    const count = await this.notificationService.contarNaoLidas(userId);

    return { count };
  }

  /**
   * Marcar como lida
   * PUT /notifications/:id/read
   */
  @Put(':id/read')
  async marcarComoLida(
    @Param('id') notificationId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.notificationService.marcarComoLida(notificationId, userId);

    return { success: true };
  }

  /**
   * Marcar todas como lidas
   * PUT /notifications/read-all
   */
  @Put('read-all')
  async marcarTodasComoLidas(@Request() req: any) {
    const userId = req.user.id;
    await this.notificationService.marcarTodasComoLidas(userId);

    return { success: true };
  }

  /**
   * Deletar notificação
   * DELETE /notifications/:id
   */
  @Delete(':id')
  async deletarNotificacao(
    @Param('id') notificationId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.notificationService.deletarNotificacao(notificationId, userId);

    return { success: true };
  }

}
