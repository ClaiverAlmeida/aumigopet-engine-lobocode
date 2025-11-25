import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateVaccineExamDto } from './dto/create-vaccine-exam.dto';
import { UpdateVaccineExamDto } from './dto/update-vaccine-exam.dto';
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
export class VaccineExamsService extends UniversalService<
  CreateVaccineExamDto,
  UpdateVaccineExamDto
> {
  private static readonly entityConfig = createEntityConfig('vaccineExam');

  constructor(
    repository: UniversalRepository<CreateVaccineExamDto, UpdateVaccineExamDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = VaccineExamsService.entityConfig;
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
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
          },
        },
      },
      transform: {
        flatten: {
          pet: { field: 'name', target: 'petName' },
        },
        custom: (data) => {
          // Verificar se está atrasado ou vencendo em breve
          if (data.nextDate) {
            const hoje = new Date();
            const proxima = new Date(data.nextDate);
            const diasRestantes = Math.ceil((proxima.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

            if (diasRestantes < 0) {
              data.status = 'OVERDUE';
            } else if (diasRestantes <= 7) {
              data.status = 'DUE_SOON';
            } else {
              data.status = 'UP_TO_DATE';
            }
          }
          return data;
        },
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateVaccineExamDto,
  ): Promise<void> {
    // Conversão de strings para Date se necessário
    if (typeof data.date === 'string') {
      (data as any).date = new Date(data.date);
    }
    if (data.nextDate && typeof data.nextDate === 'string') {
      (data as any).nextDate = new Date(data.nextDate);
    }
  }
}
