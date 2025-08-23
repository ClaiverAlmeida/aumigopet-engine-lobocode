import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ConflictError } from '../../shared/common/errors';
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
export class PostsService extends UniversalService<
  CreatePostDto,
  UpdatePostDto
> {
  private static readonly entityConfig = createEntityConfig('post');

  constructor(
    repository: UniversalRepository<CreatePostDto, UpdatePostDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = PostsService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      metricsService,
      request,
      model,
      casl,
    );
  }

  protected async antesDeCriar(data: CreatePostDto): Promise<void> {
    if (data.latitude) await this.validarLatitude(data.latitude);
    if (data.longitude) await this.validarLongitude(data.longitude);
  }

  protected async antesDeAtualizar(
    id: string,
    data: UpdatePostDto,
  ): Promise<void> {
    if (data.latitude) await this.validarLatitude(data.latitude);
    if (data.longitude) await this.validarLongitude(data.longitude);
  }

  private async validarLatitude(latitude: number): Promise<void> {
    const existingPost = await this.repository.buscarPrimeiro(this.entityName, {
      latitude,
    });
    if (existingPost) {
      throw new ConflictError('Latitude já está em uso');
    }
  }

  private async validarLongitude(longitude: number): Promise<void> {
    const existingPost = await this.repository.buscarPrimeiro(this.entityName, {
      longitude,
    });
    if (existingPost) {
      throw new ConflictError('Longitude já está em uso');
    }
  }
}
