import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
import { UpdateSocialPostDto } from './dto/update-social-post.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class SocialPostsService extends UniversalService<
  CreateSocialPostDto,
  UpdateSocialPostDto
> {
  private static readonly entityConfig = createEntityConfig('socialPost');

  constructor(
    repository: UniversalRepository<CreateSocialPostDto, UpdateSocialPostDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = SocialPostsService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        author: {
          select: { id: true, name: true, profileImage: true },
        },
        comments: {
          select: { id: true },
        },
        likes: {
          select: { id: true },
        },
      },
      transform: {
        flatten: { author: { field: 'name', target: 'authorName' } },
        custom: (data) => {
          // Adicionar contagens
          data.commentsCount = data.comments?.length || 0;
          data.likesCount = data.likes?.length || 0;
          delete data.comments;
          delete data.likes;
          return data;
        },
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreateSocialPostDto): Promise<void> {
    // Aqui podemos adicionar validações ou transformações antes de criar
    if (!data.authorId) {
      const user = this.obterUsuarioLogado();
      (data as any).authorId = user.userId;
    }
  }
}
