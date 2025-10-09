import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from './shared/notification.service';
import { AuthGuard } from '../../shared/auth/guards/auth.guard';

// ============================================================================
// 🔔 GATEWAY DE NOTIFICAÇÕES EM TEMPO REAL
// ============================================================================
// Gateway WebSocket para notificações em tempo real
// Integrado com o NotificationService existente
// ============================================================================

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  },
  // Removendo namespace - usando gateway raiz que funciona
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private readonly connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  // ============================================================================
  // 🔌 CONEXÃO E DESCONEXÃO
  // ============================================================================

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`🔌 Nova tentativa de conexão - Socket: ${client.id}`);
      
      // Extrair token do handshake
      const token = this.extractTokenFromHandshake(client);
      
      this.logger.log(`🔑 Token extraído: ${token ? token.substring(0, 20) + '...' : 'NENHUM'}`);
      
      if (!token) {
        this.logger.warn(`Conexão rejeitada: Token não encontrado - Socket: ${client.id}`);
        client.disconnect();
        return;
      }

      // Verificar e decodificar token
      this.logger.log(`🔍 Verificando token...`);
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      this.logger.log(`👤 UserId extraído: ${userId}`);

      if (!userId) {
        this.logger.warn(`Conexão rejeitada: UserId não encontrado - Socket: ${client.id}`);
        client.disconnect();
        return;
      }

      // Armazenar conexão do usuário
      this.connectedUsers.set(userId, client.id);
      client.data.userId = userId;

      this.logger.log(`Usuário conectado: ${userId} - Socket: ${client.id}`);
      
      // Enviar notificações não lidas para o usuário
      await this.enviarNotificacoesNaoLidas(client, userId);

    } catch (error) {
      this.logger.error(`Erro na conexão: ${error.message} - Socket: ${client.id}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`Usuário desconectado: ${userId} - Socket: ${client.id}`);
    }
  }

  // ============================================================================
  // 📨 MENSAGENS DO CLIENTE
  // ============================================================================

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    const userId = client.data.userId;
    const room = data.room;

    if (!userId) {
      client.emit('error', { message: 'Usuário não autenticado' });
      return;
    }

    // Validar se o usuário pode entrar na sala (ex: companyId)
    const canJoin = await this.validarAcessoASala(userId, room);
    
    if (!canJoin) {
      client.emit('error', { message: 'Acesso negado à sala' });
      return;
    }

    client.join(room);
    this.logger.log(`Usuário ${userId} entrou na sala: ${room}`);
    
    client.emit('joined_room', { room });
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    const userId = client.data.userId;
    const room = data.room;

    client.leave(room);
    this.logger.log(`Usuário ${userId} saiu da sala: ${room}`);
    
    client.emit('left_room', { room });
  }

  @SubscribeMessage('mark_notification_read')
  async handleMarkNotificationRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    const userId = client.data.userId;
    
    if (!userId) {
      client.emit('error', { message: 'Usuário não autenticado' });
      return;
    }

    try {
      await this.notificationService.marcarComoLida(data.notificationId, userId);
      
      // Atualizar contador de não lidas
      const unreadCount = await this.notificationService.contarNaoLidas(userId);
      
      client.emit('notification_marked_read', {
        notificationId: data.notificationId,
        unreadCount,
      });
    } catch (error) {
      this.logger.error(`Erro ao marcar notificação como lida: ${error.message}`);
      client.emit('error', { message: 'Erro ao marcar notificação como lida' });
    }
  }

  // ============================================================================
  // 📤 MÉTODOS PÚBLICOS PARA ENVIO DE NOTIFICAÇÕES
  // ============================================================================

  /**
   * Enviar notificação para usuário específico
   */
  async enviarParaUsuario(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    
    if (socketId) {
      this.server.to(socketId).emit('new_notification', notification);
      this.logger.log(`Notificação enviada para usuário: ${userId}`);
    } else {
      this.logger.warn(`Usuário ${userId} não está conectado`);
    }
  }

  /**
   * Enviar notificação para sala específica (ex: empresa)
   */
  async enviarParaSala(room: string, notification: any) {
    this.server.to(room).emit('new_notification', notification);
    this.logger.log(`Notificação enviada para sala: ${room}`);
  }

  /**
   * Enviar notificação para múltiplos usuários
   */
  async enviarParaUsuarios(userIds: string[], notification: any) {
    userIds.forEach(userId => {
      this.enviarParaUsuario(userId, notification);
    });
  }

  /**
   * Enviar atualização de contador de não lidas
   */
  async atualizarContadorNaoLidas(userId: string) {
    const socketId = this.connectedUsers.get(userId);
    
    if (socketId) {
      const unreadCount = await this.notificationService.contarNaoLidas(userId);
      this.server.to(socketId).emit('unread_count_updated', { unreadCount });
    }
  }

  // ============================================================================
  // 🔧 MÉTODOS PRIVADOS
  // ============================================================================

  private extractTokenFromHandshake(client: Socket): string | null {
    this.logger.log(`🔍 Extraindo token do handshake - Socket: ${client.id}`);
    
    // Tentar extrair token do header Authorization
    const authHeader = client.handshake.headers.authorization;
    this.logger.log(`📋 Authorization header: ${authHeader ? authHeader.substring(0, 20) + '...' : 'NENHUM'}`);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      this.logger.log(`✅ Token encontrado no header: ${token.substring(0, 20)}...`);
      return token;
    }

    // Tentar extrair token dos query parameters
    const token = client.handshake.query.token as string;
    this.logger.log(`📋 Query token: ${token ? token.substring(0, 20) + '...' : 'NENHUM'}`);
    
    if (token) {
      this.logger.log(`✅ Token encontrado na query: ${token.substring(0, 20)}...`);
      return token;
    }

    this.logger.warn(`❌ Nenhum token encontrado`);
    return null;
  }

  private async validarAcessoASala(userId: string, room: string): Promise<boolean> {
    // Implementar validação baseada no tipo de sala
    // Por exemplo: verificar se o usuário pertence à empresa da sala
    // Por enquanto, retorna true (implementar lógica específica)
    return true;
  }

  private async enviarNotificacoesNaoLidas(client: Socket, userId: string) {
    try {
      const { notifications } = await this.notificationService.buscarDoUsuario(userId, {
        isRead: false,
        limit: 10,
      });

      if (notifications.length > 0) {
        client.emit('unread_notifications', { notifications });
      }

      // Enviar contador de não lidas
      const unreadCount = await this.notificationService.contarNaoLidas(userId);
      client.emit('unread_count_updated', { unreadCount });

    } catch (error) {
      this.logger.error(`Erro ao enviar notificações não lidas: ${error.message}`);
    }
  }
}
