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
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
        },
        exclude: ['post'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateMotorizedServiceDto & { userId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
  }
}
