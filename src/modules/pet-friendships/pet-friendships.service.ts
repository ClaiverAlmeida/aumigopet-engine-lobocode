import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreatePetFriendshipDto } from './dto/create-pet-friendship.dto';
import { UpdatePetFriendshipDto } from './dto/update-pet-friendship.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class PetFriendshipsService extends UniversalService<
  CreatePetFriendshipDto,
  UpdatePetFriendshipDto
> {
  private static readonly entityConfig = createEntityConfig('petFriendship');

  constructor(
    repository: UniversalRepository<CreatePetFriendshipDto, UpdatePetFriendshipDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = PetFriendshipsService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        user: { select: { id: true, name: true } },
        pet: { select: { id: true, name: true } },
        friendUser: { select: { id: true, name: true } },
        friendPet: { select: { id: true, name: true } },
      },
      transform: {
        flatten: {
          pet: { field: 'name', target: 'petName' },
          friendPet: { field: 'name', target: 'friendPetName' },
        },
        custom: undefined,
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreatePetFriendshipDto): Promise<void> {
    if (!data.userId) {
      const user = this.obterUsuarioLogado();
      (data as any).userId = user.userId;
    }
  }
}
