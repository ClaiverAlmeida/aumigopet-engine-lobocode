import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
// universal imports
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class PetsService extends UniversalService<
  CreatePetDto,
  UpdatePetDto
> {
  private static readonly entityConfig = createEntityConfig('pet');

  constructor(
    repository: UniversalRepository<CreatePetDto, UpdatePetDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = PetsService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      metricsService,
      request,
      model,
      casl,
    );

    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      transform: {
        flatten: {
          owner: { field: 'name', target: 'ownerName' },
        },
        custom: (data) => {
          // Calcular idade se tiver birthDate
          if (data.birthDate && !data.age) {
            const hoje = new Date();
            const nascimento = new Date(data.birthDate);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
              idade--;
            }
            data.age = idade;
          }
          return data;
        },
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(
    data: CreatePetDto & { ownerId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.ownerId = user.id;
  }
}
