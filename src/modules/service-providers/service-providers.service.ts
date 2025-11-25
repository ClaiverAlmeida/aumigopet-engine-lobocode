import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class ServiceProvidersService extends UniversalService<
  CreateServiceProviderDto,
  UpdateServiceProviderDto
> {
  private static readonly entityConfig = createEntityConfig('serviceProvider');

  constructor(
    repository: UniversalRepository<CreateServiceProviderDto, UpdateServiceProviderDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = ServiceProvidersService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        owner: { select: { id: true, name: true } },
        services: { select: { id: true, name: true } },
        reviews: { select: { id: true, rating: true } },
      },
      transform: {
        flatten: { owner: { field: 'name', target: 'ownerName' } },
        custom: (data) => {
          // Calcular média de avaliações
          if (data.reviews && data.reviews.length > 0) {
            const totalRating = data.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
            data.averageRating = (totalRating / data.reviews.length).toFixed(1);
          } else {
            data.averageRating = '0.0';
          }
          data.servicesCount = data.services?.length || 0;
          delete data.services;
          delete data.reviews;
          return data;
        },
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreateServiceProviderDto): Promise<void> {
    if (!data.ownerId) {
      const user = this.obterUsuarioLogado();
      (data as any).ownerId = user.userId;
    }
  }
}
