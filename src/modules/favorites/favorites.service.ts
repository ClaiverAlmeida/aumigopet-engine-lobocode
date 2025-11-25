import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class FavoritesService extends UniversalService<
  CreateFavoriteDto,
  UpdateFavoriteDto
> {
  private static readonly entityConfig = createEntityConfig('favorite');

  constructor(
    repository: UniversalRepository<CreateFavoriteDto, UpdateFavoriteDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = FavoritesService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        user: { select: { id: true, name: true } },
        provider: { select: { id: true, name: true, category: true, city: true } },
      },
      transform: {
        flatten: {
          provider: { field: 'name', target: 'providerName' },
        },
        custom: undefined,
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreateFavoriteDto): Promise<void> {
    if (!data.userId) {
      const user = this.obterUsuarioLogado();
      (data as any).userId = user.userId;
    }
  }
}
