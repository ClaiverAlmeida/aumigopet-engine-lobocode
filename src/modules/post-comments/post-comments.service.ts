import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class PostCommentsService extends UniversalService<
  CreatePostCommentDto,
  UpdatePostCommentDto
> {
  private static readonly entityConfig = createEntityConfig('postComment');

  constructor(
    repository: UniversalRepository<CreatePostCommentDto, UpdatePostCommentDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = PostCommentsService.entityConfig;
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
        post: {
          select: { id: true, content: true },
        },
      },
      transform: {
        flatten: {
          author: { field: 'name', target: 'authorName' },
        },
        custom: undefined,
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreatePostCommentDto): Promise<void> {
    if (!data.authorId) {
      const user = this.obterUsuarioLogado();
      (data as any).authorId = user.userId;
    }
  }
}
