import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
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
    data: CreateSupplyDto & { userId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
  }
}
