import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateOccurrenceDispatchDto } from './dto/create-occurrences-dispatches.dto';
import { UpdateOccurrenceDispatchDto } from './dto/update-occurrences-dispatches.dto';
// universal imports
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class OccurrencesDispatchesService extends UniversalService<
  CreateOccurrenceDispatchDto,
  UpdateOccurrenceDispatchDto
> {
  private static readonly entityConfig = createEntityConfig('occurrenceDispatch');

  constructor(
    repository: UniversalRepository<CreateOccurrenceDispatchDto, UpdateOccurrenceDispatchDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = OccurrencesDispatchesService.entityConfig;
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
        post: {
          select: {
            name: true,
          },
        },
        guard: {
          select: {
            name: true,
          },
        },
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
          guard: { field: 'name', target: 'guardName' },
          },
        exclude: ['post'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateOccurrenceDispatchDto & { userId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
  }
}
