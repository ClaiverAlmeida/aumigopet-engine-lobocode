import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateDoormanChecklistDto } from './dto/create-doorman-checklist.dto';
import { UpdateDoormanChecklistDto } from './dto/update-doorman-checklist.dto';
// universal imports
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';

/**
 * Serviço para gerenciamento de checklists de porteiro
 * Seguindo exatamente a mesma lógica dos outros serviços do sistema
 */
@Injectable({ scope: Scope.REQUEST })
export class DoormanChecklistsService extends UniversalService<
  CreateDoormanChecklistDto,
  UpdateDoormanChecklistDto
> {
  private static readonly entityConfig = createEntityConfig('doormanChecklist');

  constructor(
    repository: UniversalRepository<
      CreateDoormanChecklistDto,
      UpdateDoormanChecklistDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = DoormanChecklistsService.entityConfig;
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
        user: {
          select: {
            name: true,
          },
        },
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
          user: { field: 'name', target: 'userName' },
        },
        exclude: ['post', 'user'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateDoormanChecklistDto & { userId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
  }
}
