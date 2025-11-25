import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class FollowsService extends UniversalService<
  CreateFollowDto,
  UpdateFollowDto
> {
  private static readonly entityConfig = createEntityConfig('follow');

  constructor(
    repository: UniversalRepository<CreateFollowDto, UpdateFollowDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = FollowsService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        follower: { select: { id: true, name: true, profileImage: true } },
        following: { select: { id: true, name: true, profileImage: true } },
      },
      transform: {
        flatten: {
          follower: { field: 'name', target: 'followerName' },
          following: { field: 'name', target: 'followingName' },
        },
        custom: undefined,
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreateFollowDto): Promise<void> {
    if (!data.followerId) {
      const user = this.obterUsuarioLogado();
      (data as any).followerId = user.userId;
    }
  }
}
