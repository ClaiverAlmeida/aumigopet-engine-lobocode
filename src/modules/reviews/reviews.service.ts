import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class ReviewsService extends UniversalService<
  CreateReviewDto,
  UpdateReviewDto
> {
  private static readonly entityConfig = createEntityConfig('review');

  constructor(
    repository: UniversalRepository<CreateReviewDto, UpdateReviewDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = ReviewsService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        author: { select: { id: true, name: true, profileImage: true } },
        provider: { select: { id: true, name: true } },
      },
      transform: {
        flatten: {
          author: { field: 'name', target: 'authorName' },
          provider: { field: 'name', target: 'providerName' },
        },
        custom: undefined,
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreateReviewDto): Promise<void> {
    if (!data.authorId) {
      const user = this.obterUsuarioLogado();
      (data as any).authorId = user.userId;
    }
  }
}
