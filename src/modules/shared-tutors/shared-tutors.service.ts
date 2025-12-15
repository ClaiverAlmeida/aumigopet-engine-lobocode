import { Injectable, Inject, Optional, Scope, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateSharedTutorDto } from './dto/create-shared-tutor.dto';
import { UpdateSharedTutorDto } from './dto/update-shared-tutor.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class SharedTutorsService extends UniversalService<
  CreateSharedTutorDto,
  UpdateSharedTutorDto
> {
  private static readonly entityConfig = createEntityConfig('sharedTutor');

  constructor(
    repository: UniversalRepository<CreateSharedTutorDto, UpdateSharedTutorDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private readonly prisma: PrismaService,
  ) {
    const { model, casl } = SharedTutorsService.entityConfig;
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
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        sharedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        pets: {
          include: {
            pet: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    };
  }

  protected async antesDeCriar(
    data: CreateSharedTutorDto,
  ): Promise<void> {
    // Obter usuário logado
    const user = (this as any).request?.user;
    const userId = user?.id || user?.sub;
    
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado');
    }

    // Validar se o email está registrado no app
    const invitedUser = await this.prisma.user.findFirst({
      where: {
        email: data.inviteEmail.toLowerCase().trim(),
        deletedAt: null,
      },
    });

    if (!invitedUser) {
      throw new BadRequestException('Email não encontrado. O usuário deve estar registrado no app.');
    }

    // Não permitir convidar a si mesmo
    if (invitedUser.id === userId) {
      throw new BadRequestException('Você não pode convidar a si mesmo.');
    }

    // Verificar se já existe convite para este usuário com os mesmos pets
    const normalizedEmail = data.inviteEmail.toLowerCase().trim();
    
    // Buscar convites existentes para este owner e email
    const existingInvites = await this.prisma.sharedTutor.findMany({
      where: {
        ownerId: userId,
        OR: [
          { inviteEmail: normalizedEmail },
          { sharedUserId: invitedUser.id },
        ],
        status: {
          in: ['PENDING', 'ACCEPTED'],
        },
        deletedAt: null,
      },
      include: {
        pets: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    // Verificar se algum convite existente tem os mesmos pets
    if (existingInvites.length > 0) {
      for (const existingInvite of existingInvites) {
        const existingPetIds = existingInvite.pets
          .map((p) => p.petId)
          .sort((a, b) => a.localeCompare(b));
        const newPetIds = [...data.petIds].sort((a, b) => a.localeCompare(b));

        // Verificar se os pets são os mesmos
        if (
          existingPetIds.length === newPetIds.length &&
          existingPetIds.every((id, index) => id === newPetIds[index])
        ) {
          const statusMessage =
            existingInvite.status === 'PENDING'
              ? 'já existe um convite pendente'
              : 'este usuário já tem acesso';
          throw new BadRequestException(
            `Não é possível criar convite duplicado. ${statusMessage} para este(s) pet(s).`,
          );
        }
      }
    }

    // Definir ownerId
    (data as any).ownerId = userId;

    // Definir permissões padrão se não fornecidas
    if (!data.permissions) {
      (data as any).permissions = {
        canEdit: false,
        canViewMedical: true,
        canSchedule: true,
      };
    }

    // Montar pets compartilhados via nested create
    if (data.petIds?.length) {
      (data as any).pets = {
        create: data.petIds.map((petId) => ({
          pet: { connect: { id: petId } },
        })),
      };
      // Remover petIds do objeto, pois não existe no schema do Prisma
      delete (data as any).petIds;
    }
  }

  /**
   * Sobrescreve buscarTodos para incluir verificação de inviteEmail
   * Permite que usuários vejam convites onde foram convidados por email
   */
  async buscarTodos(include?: any) {
    this.permissionService.validarAction(this.entityNameCasl, 'read');

    const user = (this as any).request?.user;
    const userEmail = user?.email?.toLowerCase().trim();

    // Obter where clause base do CASL
    const baseWhere = this.queryService.construirWhereClauseParaRead(
      this.entityNameCasl,
    );

    // Adicionar verificação de inviteEmail para permitir ver convites recebidos
    // O where clause já tem um AND com accessibleBy, então precisamos adicionar o OR dentro do AND
    if (userEmail && baseWhere.AND && Array.isArray(baseWhere.AND)) {
      // Adicionar condição OR para incluir convites onde o email corresponde
      const caslCondition = baseWhere.AND[0];
      baseWhere.AND[0] = {
        OR: [
          caslCondition,
          { inviteEmail: userEmail },
        ],
      };
    }

    // Usa includes da configuração se não for fornecido
    const includeConfig = include || this.getIncludeConfig();
    
    const entities = await this.repository.buscarMuitos(
      this.entityName,
      baseWhere,
      {
        orderBy: { createdAt: 'desc' },
      },
      includeConfig,
    );
    
    const transformedData = this.transformData(entities);
    return transformedData;
  }

  protected async antesDeAtualizar(
    id: string,
    data: UpdateSharedTutorDto,
    ): Promise<void> {
    // Se o status for ACCEPTED, buscar usuário por email e vincular
    if (data.status === 'ACCEPTED') {
      try {
        // Buscar registro atual usando o repository
        const currentRecord = await (this.repository as any).buscarUnico(
          'sharedTutor',
          { id },
        );
        
        if (currentRecord?.inviteEmail && !currentRecord.sharedUserId) {
          // Buscar usuário por email
          const user = await this.prisma.user.findFirst({
            where: {
              email: currentRecord.inviteEmail.toLowerCase().trim(),
              deletedAt: null,
            },
          });
          if (user) {
            (data as any).sharedUserId = user.id;
          }
        }
      } catch {
        // Se não encontrar o registro, ignora (será tratado pelo método de update)
      }
    }

    // Atualizar pets compartilhados, se petIds fornecido
    if ((data as any).petIds && Array.isArray((data as any).petIds)) {
      const petIds: string[] = (data as any).petIds;
      (data as any).pets = {
        deleteMany: {},
        create: petIds.map((petId) => ({
          pet: { connect: { id: petId } },
        })),
      };
      // Remover petIds do objeto, pois não existe no schema do Prisma
      delete (data as any).petIds;
    }
  }

}

