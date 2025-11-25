import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class ServicesService extends UniversalService<
  CreateServiceDto,
  UpdateServiceDto
> {
  private static readonly entityConfig = createEntityConfig('service');

  constructor(
    repository: UniversalRepository<CreateServiceDto, UpdateServiceDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = ServicesService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        provider: { select: { id: true, name: true, category: true } },
      },
      transform: {
        flatten: { provider: { field: 'name', target: 'providerName' } },
        custom: undefined,
        exclude: [],
      },
    };
  }
}
