import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { NotificationService } from './shared/notification.service';
import { NotificationController } from './notification.controller';
import { NotificationHelper } from './notification.helper';
import { NotificationGateway } from './notification.gateway';
import { NotificationRecipientsService } from './shared/notification.recipients';

// Import helpers específicos
import { SupplyNotificationHelper, SupplyContextBuilder } from './entities/supply';
import { ShiftNotificationHelper, ShiftContextBuilder } from './entities/shift';
import { OccurrenceNotificationHelper, OccurrenceContextBuilder } from './entities/occurrence';
import { VehicleChecklistNotificationHelper, VehicleChecklistContextBuilder } from './entities/vehicle-checklist';
import { UserNotificationHelper, UserContextBuilder } from './entities/user';
import { DoormanChecklistNotificationHelper, DoormanChecklistContextBuilder } from './entities/doorman-checklist';
import { MotorcycleChecklistNotificationHelper, MotorcycleChecklistContextBuilder } from './entities/motorcycle-checklist';
import { MotorizedServiceNotificationHelper, MotorizedServiceContextBuilder } from './entities/motorized-service';
import { OccurrenceDispatchNotificationHelper, OccurrenceDispatchContextBuilder } from './entities/occurrence-dispatch';
import { PatrolNotificationHelper, PatrolContextBuilder } from './entities/patrol';

/**
 * 🔔 MÓDULO GLOBAL DE NOTIFICAÇÕES
 * 
 * Módulo global que fornece funcionalidades de notificação para todo o sistema.
 * Inclui:
 * - NotificationService: Lógica principal de notificações
 * - NotificationHelper: Métodos simplificados por entidade
 * - NotificationGateway: WebSocket para tempo real
 */
@Global()
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationHelper,
    NotificationGateway,
    NotificationRecipientsService,
    // Helpers específicos
    SupplyNotificationHelper,
    SupplyContextBuilder,
    ShiftNotificationHelper,
    ShiftContextBuilder,
    OccurrenceNotificationHelper,
    OccurrenceContextBuilder,
    VehicleChecklistNotificationHelper,
    VehicleChecklistContextBuilder,
    UserNotificationHelper,
    UserContextBuilder,
    DoormanChecklistNotificationHelper,
    DoormanChecklistContextBuilder,
    MotorcycleChecklistNotificationHelper,
    MotorcycleChecklistContextBuilder,
    MotorizedServiceNotificationHelper,
    MotorizedServiceContextBuilder,
    OccurrenceDispatchNotificationHelper,
    OccurrenceDispatchContextBuilder,
    PatrolNotificationHelper,
    PatrolContextBuilder,
  ],
  exports: [
    NotificationService,
    NotificationHelper,
    NotificationGateway,
    NotificationRecipientsService,
    // Helpers específicos
    SupplyNotificationHelper,
    SupplyContextBuilder,
    ShiftNotificationHelper,
    ShiftContextBuilder,
    OccurrenceNotificationHelper,
    OccurrenceContextBuilder,
    VehicleChecklistNotificationHelper,
    VehicleChecklistContextBuilder,
    UserNotificationHelper,
    UserContextBuilder,
    DoormanChecklistNotificationHelper,
    DoormanChecklistContextBuilder,
    MotorcycleChecklistNotificationHelper,
    MotorcycleChecklistContextBuilder,
    MotorizedServiceNotificationHelper,
    MotorizedServiceContextBuilder,
    OccurrenceDispatchNotificationHelper,
    OccurrenceDispatchContextBuilder,
    PatrolNotificationHelper,
    PatrolContextBuilder,
  ],
})
export class NotificationModule {}
