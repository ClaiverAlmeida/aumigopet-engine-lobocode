import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpdateWeightRecordDto } from './dto/update-weight-record.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';

@Injectable({ scope: Scope.REQUEST })
export class WeightRecordsService extends UniversalService<
  CreateWeightRecordDto,
  UpdateWeightRecordDto
> {
  private static readonly entityConfig = createEntityConfig('weightRecord');

  constructor(
    repository: UniversalRepository<CreateWeightRecordDto, UpdateWeightRecordDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = WeightRecordsService.entityConfig;
    super(repository, queryService, permissionService, metricsService, request, model, casl);
    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        pet: {
          select: { id: true, name: true, idealWeightMin: true, idealWeightMax: true },
        },
      },
      transform: {
        flatten: { pet: { field: 'name', target: 'petName' } },
        custom: (data) => {
          // Calcular status baseado no peso ideal
          if (data.pet?.idealWeightMin && data.pet?.idealWeightMax) {
            if (data.weight < data.pet.idealWeightMin) {
              data.status = 'UNDERWEIGHT';
            } else if (data.weight > data.pet.idealWeightMax) {
              data.status = 'OVERWEIGHT';
            } else {
              data.status = 'NORMAL';
            }
          }
          return data;
        },
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(data: CreateWeightRecordDto): Promise<void> {
    if (data.date && typeof data.date === 'string') {
      (data as any).date = new Date(data.date);
    }
  }
}
