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
            model: true,
          },
        },
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
          vehicle: { field: 'model', target: 'vehicleModel' },
        },
        exclude: ['post', 'vehicle'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateVehicleChecklistDto & { userId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
  }
}
