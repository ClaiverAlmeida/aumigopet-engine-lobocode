import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
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
export class RemindersService extends UniversalService<
  CreateReminderDto,
  UpdateReminderDto
> {
  private static readonly entityConfig = createEntityConfig('reminder');

  constructor(
    repository: UniversalRepository<CreateReminderDto, UpdateReminderDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = RemindersService.entityConfig;
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
          // Verificar se o lembrete está atrasado
          const hoje = new Date();
          const dataLembrete = new Date(data.date);
          
          if (dataLembrete < hoje && data.status === 'PENDING') {
            data.status = 'OVERDUE';
          }
          
          return data;
        },
        exclude: [],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateReminderDto,
  ): Promise<void> {
    // Conversão de string para Date se necessário
    if (typeof data.date === 'string') {
      (data as any).date = new Date(data.date);
    }
  }
}
