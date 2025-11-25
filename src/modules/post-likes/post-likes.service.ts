import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { UpdatePostLikeDto } from './dto/update-post-like.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class PostLikesService extends UniversalService<
  CreatePostLikeDto,
  UpdatePostLikeDto
> {
  private static readonly entityConfig = createEntityConfig('postLike');

  constructor(
    repository: UniversalRepository<CreatePostLikeDto, UpdatePostLikeDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = PostLikesService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        user: { select: { id: true, name: true } },
        post: { select: { id: true } },
      },
      transform: {
        flatten: {},
        custom: undefined,
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreatePostLikeDto): Promise<void> {
    if (!data.userId) {
      const user = this.obterUsuarioLogado();
      (data as any).userId = user.userId;
    }
  }
}
