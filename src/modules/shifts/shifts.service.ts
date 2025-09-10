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
import { ShiftStatus } from '@prisma/client';

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
 
    return super.criar(shiftData);
  }

  async inicioDoIntervalo(id: string, data: UpdateShiftDto) {
    const shiftData = {
      breakStartTime: data.breakStartTime,
      status: ShiftStatus.BREAK,
    };
    return super.atualizar(id, shiftData);
  }

  async fimDoIntervalo(id: string, data: UpdateShiftDto) {
    const shiftData = {
      breakEndTime: data.breakEndTime,
      status: ShiftStatus.IN_PROGRESS,
    };
    return super.atualizar(id, shiftData);
  }

  async fimDoTurno(id: string, data: UpdateShiftDto) {
    const shiftData = {
      endTime: data.endTime,
      status: ShiftStatus.COMPLETED,
    };
    return super.atualizar(id, shiftData);
  }

  protected async antesDeCriar(
    data: CreateShiftDto & { userId: string },
  ): Promise<void> {
    if (!data.startTime) throw new RequiredFieldError('startTime');

    if (data.postId) await this.postsService.validarExistencia(data.postId);
    else throw new RequiredFieldError('postId');

    const userId = this.obterUsuarioLogadoId();
    if (!userId)
      throw new NotFoundError('Usuário', 'não está autenticado', 'userId');

    data.userId = userId;
    data.status = ShiftStatus.IN_PROGRESS;
  }
}
