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
import { Roles, ShiftStatus } from '@prisma/client'; 
// notification imports
import { NotificationHelper } from '../notifications/notification.helper';


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
      console.error('Erro ao enviar notificação de intervalo finalizado:', error);
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

  protected async antesDeCriar(
    data: CreateShiftDto & { userId: string },
  ): Promise<void> {
    if (!data.startTime) throw new RequiredFieldError('startTime');

    const user = this.obterUsuarioLogado();
    if (!user)
      throw new NotFoundError('Usuário', 'não está autenticado', 'user');

    if (user.role === Roles.SUPERVISOR) {
      delete data.postId;
    } else {
      if (data.postId) await this.postsService.validarExistencia(data.postId);
      else throw new RequiredFieldError('postId');
    }

    data.userId = user.id;
    data.status = ShiftStatus.IN_PROGRESS;
  }
}
