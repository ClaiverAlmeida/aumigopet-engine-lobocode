import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateMotorizedServiceDto } from './dto/create-motorized-service.dto';
import { UpdateMotorizedServiceDto } from './dto/update-motorized-service.dto';
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

@Injectable({ scope: Scope.REQUEST })
export class MotorizedServicesService extends UniversalService<
  CreateMotorizedServiceDto,
  UpdateMotorizedServiceDto
> {
  private static readonly entityConfig = createEntityConfig('motorizedService');

  constructor(
    repository: UniversalRepository<
      CreateMotorizedServiceDto,
      UpdateMotorizedServiceDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
  ) {
    const { model, casl } = MotorizedServicesService.entityConfig;
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
    data: CreateMotorizedServiceDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Notificar criação de serviço motorizado
      await this.notificationHelper.servicoMotorizadoCriado(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error(
        'Erro ao enviar notificação de serviço motorizado criado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateMotorizedServiceDto,
  ): Promise<void> {
    try {
      // Notificar atualização de serviço motorizado
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi finalizado
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.servicoMotorizadoFinalizado(
          id,
          user.id,
          companyId,
        );
      } else {
        await this.notificationHelper.servicoMotorizadoAtualizado(
          id,
          user.id,
          companyId,
        );
      }
    } catch (error) {
      console.error(
        'Erro ao enviar notificação de serviço motorizado atualizado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação
    }
  }

}
