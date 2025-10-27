import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
} from '../../shared/universal/index';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import {
  ConflictError,
  NotFoundError,
  RequiredFieldError,
} from '../../shared/common/errors';
import { UniversalQueryService } from 'src/shared/universal/services/query.service';
import { UniversalPermissionService } from 'src/shared/universal/services/permission.service';
// ✨ Importar helper de mapeamento automático
import { createEntityConfig } from '../../shared/universal/types';
import { PostsService } from '../posts/posts.service';
import {
  Roles,
  ShiftFunction,
  ShiftStatus,
  ReportStatus,
} from '@prisma/client';
// notification imports
import { NotificationHelper } from '../notifications/notification.helper';
// report services imports
import { MotorizedServicesService } from '../reports/motorized-services/motorized-service.service';
import { OccurrencesService } from '../reports/occurrences/occurrences.service';
import { VehicleChecklistsService } from '../reports/vehicle-checklists/vehicle-checklists.service';
import { SuppliesService } from '../reports/supplies/supplies.service';
import { DoormanChecklistsService } from '../reports/doorman-checklists/doorman-checklists.service';
import { ArmamentChecklistsService } from '../reports/armament-checklists/armament-checklists.service';
import { MotorcycleChecklistsService } from '../reports/motorcycle-checklists/motorcycle-checklists.service';
import { OccurrencesDispatchesService } from '../reports/occurrence-dispatch/occurrences-dispatches.service';

@Injectable({ scope: Scope.REQUEST })
export class ShiftsService extends UniversalService<
  CreateShiftDto,
  UpdateShiftDto
> {
  private static readonly entityConfig = createEntityConfig('shift');
  protected removeCompanyIdInWhereClause: boolean = true;

  constructor(
    repository: UniversalRepository<CreateShiftDto, UpdateShiftDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private postsService: PostsService,
    private notificationHelper: NotificationHelper,
    // Report services
    private motorizedServicesService: MotorizedServicesService,
    private occurrencesService: OccurrencesService,
    private vehicleChecklistsService: VehicleChecklistsService,
    private suppliesService: SuppliesService,
    private doormanChecklistsService: DoormanChecklistsService,
    private armamentChecklistsService: ArmamentChecklistsService,
    private motorcycleChecklistsService: MotorcycleChecklistsService,
    private occurrencesDispatchesService: OccurrencesDispatchesService,
  ) {
    const { model, casl } = ShiftsService.entityConfig;
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
        post: true,
        user: true,
        VehicleChecklist: true,
      },
      transform: {
        custom: (data: any) => {
          if (data?.user) data.userName = data.user.name;
          if (data?.post) data.postName = data.post.name;
          return data;
        },
      },
    };
  }

  buscarEmAndamento() {
    const userId = this.obterUsuarioLogadoId();
    return super.buscarPorCampos({
      status: { not: ShiftStatus.COMPLETED },
      userId,
    });
  }

  buscarPorId(id: string) {
    return super.buscarPorId(id, {
      post: true,
      user: true,
      patrols: true,
      occurrences: true,
      OccurrenceDispatch: true,
      DoormanChecklist: true,
      ArmamentChecklist: true,
      VehicleChecklist: true,
      MotorcycleChecklist: true,
      MotorizedService: true,
      Supply: true,
 
    });
  }

  async inicioDoTurno(data: CreateShiftDto) {
    const shift = await this.buscarEmAndamento();
    if (shift.data && shift.data?.length > 0) {
      throw new ConflictError('Já existe um turno em andamento');
    }

    const shiftData = {
      startTime: data.startTime,
      postId: data.postId,
      function: data.function,
      status: ShiftStatus.IN_PROGRESS,
    };

    const result = await super.criar(shiftData);

    // Notificar início do turno
    try {
      // O result é um array, pegamos o primeiro item
      const createdShift = Array.isArray(result) ? result[0] : result;
      await this.notificationHelper.turnoIniciado(
        createdShift.id,
        this.obterUsuarioLogado().id,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de turno iniciado:', error);
      // Não falhar a operação principal por causa da notificação
    }

    return result;
  }

  protected async antesDeCriar(
    data: CreateShiftDto & { userId: string },
  ): Promise<void> {
    if (!data.startTime) throw new RequiredFieldError('startTime');

    const user = this.obterUsuarioLogado();
    if (!user)
      throw new NotFoundError('Usuário', 'não está autenticado', 'user');

    if (data.function === ShiftFunction.SUPERVISOR) {
      delete data.postId;
    } else {
      if (data.postId) await this.postsService.validarExistencia(data.postId);
      else throw new RequiredFieldError('postId');
    }

    data.userId = user.id;
    data.status = ShiftStatus.IN_PROGRESS;
  }

  async inicioDoIntervalo(id: string, data: UpdateShiftDto) {
    const shiftData = {
      breakStartTime: data.breakStartTime,
      status: ShiftStatus.BREAK,
    };

    const result = await super.atualizar(id, shiftData);

    // Notificar início do intervalo
    try {
      await this.notificationHelper.turnoEmIntervalo(
        id,
        this.obterUsuarioLogado().id,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de turno em intervalo:', error);
      // Não falhar a operação principal por causa da notificação
    }

    return result;
  }

  async fimDoIntervalo(id: string, data: UpdateShiftDto) {
    const shiftData = {
      breakEndTime: data.breakEndTime,
      status: ShiftStatus.IN_PROGRESS,
    };

    const result = await super.atualizar(id, shiftData);

    // Notificar fim do intervalo
    try {
      await this.notificationHelper.intervaloFinalizado(
        id,
        this.obterUsuarioLogado().id,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error(
        'Erro ao enviar notificação de intervalo finalizado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação
    }

    return result;
  }

  async fimDoTurno(id: string, data: UpdateShiftDto) {
    const shiftData = {
      endTime: data.endTime,
      status: ShiftStatus.COMPLETED,
    };

    const result = await super.atualizar(id, shiftData);

    // Finalizar automaticamente todos os relatórios em aberto do turno
    try {
      await this.finalizarRelatoriosAbertos(id);
    } catch (error) {
      console.error('Erro ao finalizar relatórios automaticamente:', error);
      // Não falhar a operação principal por causa da finalização dos relatórios
    }

    // Notificar fim do turno
    try {
      await this.notificationHelper.turnoFinalizado(
        id,
        this.obterUsuarioLogado().id,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de turno finalizado:', error);
      // Não falhar a operação principal por causa da notificação
    }

    return result;
  }

  /**
   * Finaliza automaticamente todos os relatórios em aberto do turno
   */
  private async finalizarRelatoriosAbertos(shiftId: string): Promise<void> {
    const companyId = this.obterCompanyId();
    const userId = this.obterUsuarioLogado().id;

    if (!companyId) {
      console.error(
        '❌ CompanyId não encontrado, não é possível finalizar relatórios',
      );
      return;
    }

    // Buscar e finalizar relatórios de serviço motorizado
    await this.finalizarRelatoriosPorTipo(
      'motorizedService',
      shiftId,
      companyId,
      userId,
    );

    // Buscar e finalizar ocorrências
    await this.finalizarRelatoriosPorTipo(
      'occurrence',
      shiftId,
      companyId,
      userId,
    );

    // Buscar e finalizar checklists de veículo
    await this.finalizarRelatoriosPorTipo(
      'vehicleChecklist',
      shiftId,
      companyId,
      userId,
    );

    // Buscar e finalizar abastecimentos
    await this.finalizarRelatoriosPorTipo('supply', shiftId, companyId, userId);

    // Buscar e finalizar checklists de porteiro
    await this.finalizarRelatoriosPorTipo(
      'doormanChecklist',
      shiftId,
      companyId,
      userId,
    );

    // Buscar e finalizar checklists de motocicleta
    await this.finalizarRelatoriosPorTipo(
      'motorcycleChecklist',
      shiftId,
      companyId,
      userId,
    );

    // Buscar e finalizar despachos de ocorrência
    await this.finalizarRelatoriosPorTipo(
      'occurrenceDispatch',
      shiftId,
      companyId,
      userId,
    );
  }

  /**
   * Finaliza relatórios de um tipo específico
   */
  private async finalizarRelatoriosPorTipo(
    reportType: string,
    shiftId: string,
    companyId: string,
    userId: string,
  ): Promise<void> {
    try {
      let service: any;
      let modelName: string;

      // Selecionar o serviço correto baseado no tipo
      switch (reportType) {
        case 'motorizedService':
          service = this.motorizedServicesService;
          modelName = 'MotorizedService';
          break;
        case 'occurrence':
          service = this.occurrencesService;
          modelName = 'Occurrence';
          break;
        case 'vehicleChecklist':
          service = this.vehicleChecklistsService;
          modelName = 'VehicleChecklist';
          break;
        case 'supply':
          service = this.suppliesService;
          modelName = 'Supply';
          break;
          case 'doormanChecklist':
            service = this.doormanChecklistsService;
            modelName = 'DoormanChecklist';
            break;
        case 'armamentChecklist':
          service = this.armamentChecklistsService;
          modelName = 'ArmamentChecklist';
          break;
        case 'motorcycleChecklist':
          service = this.motorcycleChecklistsService;
          modelName = 'MotorcycleChecklist';
          break;
        case 'occurrenceDispatch':
          service = this.occurrencesDispatchesService;
          modelName = 'OccurrenceDispatch';
          break;
        default:
          return;
      }

      // Buscar relatórios em aberto usando o método público do serviço
      const openReports = await service.buscarMuitosPorCampos({
        shiftId,
        companyId,
        status: {
          in: [ReportStatus.PENDING, ReportStatus.IN_PROGRESS],
        },
      });

      if (!openReports.data || openReports.data.length === 0) {
        return;
      }

      // Finalizar cada relatório usando o serviço específico
      for (const report of openReports.data) {
        try {
          await service.atualizar(report.id, {
            status: ReportStatus.RESOLVED,
          });
        } catch (error) {
          console.error(
            `Erro ao finalizar relatório ${reportType} ${report.id}:`,
            error,
          );
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar relatórios ${reportType}:`, error);
    }
  }
}
