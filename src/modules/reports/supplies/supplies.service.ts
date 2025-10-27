import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { Supply } from '@prisma/client';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
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
export class SuppliesService extends UniversalService<
  CreateSupplyDto,
  UpdateSupplyDto
> {
  private static readonly entityConfig = createEntityConfig('supply');

  constructor(
    repository: UniversalRepository<CreateSupplyDto, UpdateSupplyDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
  ) {
    const { model, casl } = SuppliesService.entityConfig;
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
    data: CreateSupplyDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: Supply): Promise<void> {
    try {
      // Notificar criação de suprimento com ID real
      await this.notificationHelper.supplyCriado(
        data.id, // ✅ ID real do supply criado
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de supply criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateSupplyDto,
  ): Promise<void> {
    try {
      // Notificar atualização de abastecimento
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      if (data.status === 'RESOLVED') {
        await this.notificationHelper.supplyFinalizado(id, user.id, companyId);
      } else {
        await this.notificationHelper.supplyAtualizado(id, user.id, companyId);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de supply atualizado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

}
