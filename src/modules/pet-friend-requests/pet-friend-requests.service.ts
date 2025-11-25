import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreatePetFriendRequestDto } from './dto/create-pet-friend-request.dto';
import { UpdatePetFriendRequestDto } from './dto/update-pet-friend-request.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class PetFriendRequestsService extends UniversalService<
  CreatePetFriendRequestDto,
  UpdatePetFriendRequestDto
> {
  private static readonly entityConfig = createEntityConfig('petFriendRequest');

  constructor(
    repository: UniversalRepository<CreatePetFriendRequestDto, UpdatePetFriendRequestDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = PetFriendRequestsService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        requester: { select: { id: true, name: true } },
        pet: { select: { id: true, name: true, ownerId: true } },
      },
      transform: {
        flatten: {
          requester: { field: 'name', target: 'requesterName' },
          pet: { field: 'name', target: 'petName' },
        },
        custom: undefined,
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreatePetFriendRequestDto): Promise<void> {
    if (!data.requesterId) {
      const user = this.obterUsuarioLogado();
      (data as any).requesterId = user.userId;
    }
  }
}
