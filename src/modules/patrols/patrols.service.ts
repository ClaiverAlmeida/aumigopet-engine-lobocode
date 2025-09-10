import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PatrolStatus, CheckpointStatus } from '@prisma/client';
// dto imports
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { UpdatePatrolDto } from './dto/update-patrol.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import {
  ConflictError,
  NotFoundError,
  RequiredFieldError,
} from '../../shared/common/errors';
// universal imports
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';
import { PostsService } from '../posts/posts.service';
import { ShiftsService } from '../shifts/shifts.service';

@Injectable({ scope: Scope.REQUEST })
export class PatrolsService extends UniversalService<
  CreatePatrolDto,
  UpdatePatrolDto
> {
  private static readonly entityConfig = createEntityConfig('patrol');

  constructor(
    repository: UniversalRepository<CreatePatrolDto, UpdatePatrolDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private postsService: PostsService,
    private shiftsService: ShiftsService,
  ) {
    const { model, casl } = PatrolsService.entityConfig;
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
          user: { field: 'name', target: 'userName' },
          post: { field: 'name', target: 'postName' },
        },
        exclude: ['post', 'user'],
      },
    };
  }

  // ============================================================================
  // 📋 MÉTODOS ESPECÍFICOS PARA RONDAS
  // ============================================================================

  buscarEmAndamento() {
    const userId = this.obterUsuarioLogadoId();
    return super.buscarPorCampos({
      status: { not: PatrolStatus.COMPLETED },
      userId,
    });
  }

  /**
   * Inicia uma nova ronda
   */
  async iniciarRonda(dto: CreatePatrolDto) {
    const activePatrol = await this.buscarEmAndamento();
    if (activePatrol.data && activePatrol.data?.length > 0) {
      throw new ConflictError('Já existe uma ronda ativa para este usuário');
    }

    // 2. Preparar dados da ronda
    const patrolData = {
      description: dto.description,
      postId: dto.postId,
      shiftId: dto.shiftId,
      status: PatrolStatus.STARTED,
      startTime: new Date(),
    };

    // 3. Criar ronda usando método herdado
    const patrol = await super.criar(patrolData);

    // 4. Retornar ronda simples com checkpoints fake
    return {
      ...patrol,
      checkpoints: [
        // {
        //   id: 'checkpoint-1',
        //   name: 'Portaria Principal',
        //   latitude: -23.5273893,
        //   longitude: -46.7923013,
        //   required: true,
        //   status: 'pending',
        // },
      ],
    };
  }

  /**
   * Completa uma ronda
   */
  async completarRonda(id: string, dto: UpdatePatrolDto) {
    // Usar método herdado para buscar
    const patrol = await this.buscarPorId(id);
    if (!patrol) {
      throw new NotFoundError('patrol', id);
    }

    return this.atualizar(id, {
      ...dto,
      status: PatrolStatus.COMPLETED,
      endTime: new Date(),
    });
  }
  /**
   * Pausa uma ronda
   */
  async pausarRonda(id: string, dto: UpdatePatrolDto) {
    // Usar método herdado para buscar
    const patrol = await this.buscarPorId(id);
    if (!patrol) {
      throw new NotFoundError('patrol', id);
    }

    return this.atualizar(id, {
      ...dto,
      status: PatrolStatus.PAUSED,
      pausedAt: new Date(),
    });
  }
  /**
   * Resuma uma ronda
   */
  async resumirRonda(id: string, dto: UpdatePatrolDto) {
    // Usar método herdado para buscar
    const patrol = await this.buscarPorId(id);
    if (!patrol) {
      throw new NotFoundError('patrol', id);
    }

    return this.atualizar(id, {
      ...dto,
      status: PatrolStatus.STARTED,
      resumedAt: new Date(),
    });
  }

  /**
   * Salva ronda com supervisão
   */
  async salvarComSupervisao(id: string, dto: UpdatePatrolDto) {
    return this.atualizar(id, {
      ...dto,
      status: PatrolStatus.COMPLETED,
      endTime: new Date(),
      supervisorApproval: true,
    });
  }
  /**
   * Busca checkpoints disponíveis
   */
  async buscarCheckpoints(companyId: string, postId?: string) {
    // Simplificado: retornar checkpoints fake por enquanto
    // TODO: Implementar busca real quando a integração estiver estável
    return [
      {
        id: 'checkpoint-1',
        name: 'Portaria Principal',
        latitude: -23.5273893,
        longitude: -46.7993643,
        required: true,
        category: 'SECURITY',
        isActive: true,
      },
      {
        id: 'checkpoint-2',
        name: 'Área de Lazer',
        latitude: -23.5275893,
        longitude: -46.7995643,
        required: false,
        category: 'SECURITY',
        isActive: true,
      },
    ];
  }

  /**
   * Atualiza status de um checkpoint
   */
  async atualizarCheckpoint(
    patrolId: string,
    checkpointId: string,
    dto: UpdateCheckpointDto,
  ) {
    // Simplificado: retornar sucesso por enquanto
    // TODO: Implementar atualização real quando a integração estiver estável
    return {
      id: `patrol-checkpoint-${Date.now()}`,
      patrolId,
      checkpointId,
      status: dto.status,
      notes: dto.notes,
      completedAt: dto.completedAt || new Date(),
    };
  }

  // ============================================================================
  // 📋 MÉTODOS AUXILIARES SIMPLIFICADOS
  // ============================================================================

  /**
   * Busca ronda com checkpoints inclusos
   */
  private async buscarComCheckpoints(patrolId: string) {
    // Simplificado: buscar apenas a ronda básica
    const patrol = await this.buscarPorId(patrolId);

    // Adicionar checkpoints fake
    return {
      ...patrol,
      checkpoints: [
        {
          id: 'patrol-checkpoint-1',
          status: 'PENDING',
          checkpoint: {
            id: 'checkpoint-1',
            name: 'Portaria Principal',
            latitude: -23.5273893,
            longitude: -46.7993643,
            required: true,
          },
        },
      ],
    };
  }

  /**
   * Cria checkpoints para uma ronda (simplificado)
   */
  private async criarCheckpointsParaRonda(
    patrolId: string,
    checkpoints: any[],
  ) {
    // Por enquanto, não criar nada para evitar complexidade
    // TODO: Implementar criação real quando necessário
    return [];
  }

  protected async antesDeCriar(
    data: CreatePatrolDto & { userId: string },
  ): Promise<void> {
    if (data.shiftId) await this.shiftsService.validarExistencia(data.shiftId);
    else throw new RequiredFieldError('shiftId');

    if (data.postId) await this.postsService.validarExistencia(data.postId);
    else throw new RequiredFieldError('postId');

    const userId = this.obterUsuarioLogadoId();
    if (!userId)
      throw new NotFoundError('Usuário', 'não está autenticado', 'userId');

    data.userId = userId;
  }
}
