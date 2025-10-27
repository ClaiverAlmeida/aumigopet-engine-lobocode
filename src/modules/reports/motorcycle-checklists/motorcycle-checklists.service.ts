import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateMotorcycleChecklistDto } from './dto/create-motorcycle-checklist.dto';
import { UpdateMotorcycleChecklistDto } from './dto/update-motorcycle-checklist.dto';
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
 * - Includes de relacionamentos (post, motorcycle)
 * - Transformações de dados (flatten de objetos aninhados)
 * - Remoção de campos desnecessários
 *
 * O sistema aplica automaticamente essas configurações em:
 * - buscarComPaginacao()
 * - criar()
 * - atualizar()
 */
@Injectable({ scope: Scope.REQUEST })
export class MotorcycleChecklistsService extends UniversalService<
  CreateMotorcycleChecklistDto,
  UpdateMotorcycleChecklistDto
> {
  private static readonly entityConfig = createEntityConfig('motorcycleChecklist');

  constructor(
    repository: UniversalRepository<
      CreateMotorcycleChecklistDto,
        UpdateMotorcycleChecklistDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
  ) {
    const { model, casl } = MotorcycleChecklistsService.entityConfig;
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
        motorcycle: {
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
          if (data.motorcycle && data.motorcycle.plate) {
            data.motorcyclePlate = data.motorcycle.plate;
            data.motorcycleModel = data.motorcycle.model;
          }
          return data;
        },
        exclude: ['post', 'motorcycle'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateMotorcycleChecklistDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Notificar criação de checklist de motocicleta
      await this.notificationHelper.checklistMotocicletaCriado(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de checklist de motocicleta criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateMotorcycleChecklistDto,
  ): Promise<void> {
    try {
      // Notificar atualização de checklist de motocicleta
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi finalizado
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.checklistMotocicletaFinalizado(id, user.id, companyId);
      } else {
        await this.notificationHelper.checklistMotocicletaAtualizado(id, user.id, companyId);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de checklist de motocicleta atualizado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }
}
