import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
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
export class VehiclesService extends UniversalService<
  CreateVehicleDto,
  UpdateVehicleDto
> {
  private static readonly entityConfig = createEntityConfig('vehicle');

  constructor(
    repository: UniversalRepository<CreateVehicleDto, UpdateVehicleDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = VehiclesService.entityConfig;
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

  protected async antesDeCriar(data: CreateVehicleDto): Promise<void> {
    await this.validarPlacaUnica(data.plate);
    await this.validarQuilometragemInicial(data.initialKm);
  }

  protected async antesDeAtualizar(
    id: string,
    data: UpdateVehicleDto,
  ): Promise<void> {
    if (data.plate) {
      await this.validarPlacaUnica(data.plate, id);
    }
    if (data.initialKm !== undefined) {
      await this.validarQuilometragemInicial(data.initialKm);
    }
  }

  private async validarPlacaUnica(
    plate: string,
    excludeId?: string,
  ): Promise<void> {
    const where: any = { plate };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const existingVehicle = await this.repository.buscarPrimeiro(
      this.entityName,
      where,
    );
    if (existingVehicle) {
      throw new ConflictError('Placa já está em uso');
    }
  }

  private async validarQuilometragemInicial(initialKm: number): Promise<void> {
    if (initialKm < 0) {
      throw new ConflictError('Quilometragem inicial não pode ser negativa');
    }
  }
}
