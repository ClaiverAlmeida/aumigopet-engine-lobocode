import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateVehicleChecklistDto } from './dto/create-vehicle-checklist.dto';
import { UpdateVehicleChecklistDto } from './dto/update-vehicle-checklist.dto';
// universal imports
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';
// notification imports
import { NotificationHelper } from '../../notifications/notification.helper';
// talao service
import { TalaoNumberService } from '../services/talao-number.service';

/**
 * Exemplo de uso do sistema de includes e transformações do UniversalService
 *
 * Este serviço demonstra como configurar automaticamente:
 * - Includes de relacionamentos (post, vehicle)
 * - Transformações de dados (flatten de objetos aninhados)
 * - Remoção de campos desnecessários
 *
 * O sistema aplica automaticamente essas configurações em:
 * - buscarComPaginacao()
 * - criar()
 * - atualizar()
 */
@Injectable({ scope: Scope.REQUEST })
export class VehicleChecklistsService extends UniversalService<
  CreateVehicleChecklistDto,
  UpdateVehicleChecklistDto
> {
  private static readonly entityConfig = createEntityConfig('vehicleChecklist');

  constructor(
    repository: UniversalRepository<
      CreateVehicleChecklistDto,
      UpdateVehicleChecklistDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
  ) {
    const { model, casl } = VehicleChecklistsService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      metricsService,
      request,
      model,
      casl,
    );

    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        post: {
          select: {
            name: true,
          },
        },
        vehicle: {
          select: {
            plate: true,
            model: true,
          },
        },
      },

      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
        },
        custom: (data) => {
          // Extrair placa do veículo se existir
          if (data.vehicle && data.vehicle.plate) {
            data.vehiclePlate = data.vehicle.plate;
            data.vehicleModel = data.vehicle.model;
          }
          return data;
        },
        exclude: ['post', 'vehicle'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateVehicleChecklistDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Notificar criação de checklist de veículo
      await this.notificationHelper.checklistVeiculoCriado(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de checklist criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateVehicleChecklistDto,
  ): Promise<void> {
    try {
      // Notificar atualização de checklist de veículo
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi finalizado
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.checklistVeiculoFinalizado(
          id,
          user.id,
          companyId,
        );
      } else {
        await this.notificationHelper.checklistVeiculoAtualizado(
          id,
          user.id,
          companyId,
        );
      }
    } catch (error) {
      console.error(
        'Erro ao enviar notificação de checklist atualizado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação
    }
  }
}
