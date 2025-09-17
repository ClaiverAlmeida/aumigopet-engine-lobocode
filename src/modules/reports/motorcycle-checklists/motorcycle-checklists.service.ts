import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateMotorcycleChecklistDto } from './dto/create-motorcycle-checklist.dto';
import { UpdateMotorcycleChecklistDto } from './dto/update-motorcycle-checklist.dto';
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
 * Exemplo de uso do sistema de includes e transformações do UniversalService
 *
 * Este serviço demonstra como configurar automaticamente:
 * - Includes de relacionamentos (post, motorcycle)
 * - Transformações de dados (flatten de objetos aninhados)
 * - Remoção de campos desnecessários
 *
 * O sistema aplica automaticamente essas configurações em:
 * - buscarComPaginacao()
 * - criar()
 * - atualizar()
 */
@Injectable({ scope: Scope.REQUEST })
export class MotorcycleChecklistsService extends UniversalService<
  CreateMotorcycleChecklistDto,
  UpdateMotorcycleChecklistDto
> {
  private static readonly entityConfig = createEntityConfig('motorcycleChecklist');

  constructor(
    repository: UniversalRepository<
      CreateMotorcycleChecklistDto,
        UpdateMotorcycleChecklistDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = MotorcycleChecklistsService.entityConfig;
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
        motorcycle: {
          select: { 
            model: true,
          },
        },
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
          motorcycle: { field: 'model', target: 'motorcycleModel' },
        }, 
      },
    };
  }

  protected async antesDeCriar(
    data: CreateMotorcycleChecklistDto & { userId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
  }
}
