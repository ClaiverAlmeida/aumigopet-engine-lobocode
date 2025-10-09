import { Injectable, Scope } from '@nestjs/common';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { $Enums, Post, Roles, User, PermissionType } from '@prisma/client';

// TODO: Verificar se PermissionType está sendo exportado corretamente
// Se não estiver, usar string literal temporariamente
type PermissionTypeLiteral = 'DOORMAN' | 'SUPPORT' | 'PATROL';

// Tipo estendido para User com permissões
type UserWithPermissions = User & {
  permissions?: Array<{
    permissionType: PermissionType;
    granted: boolean;
  }>;
};

export type PermActions =
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'cancel'
  | 'approve'
  | 'export';

export type PermissionResource =
  | Subjects<{
      User: User;
      Post: Post;
      SecurityPost: any;
      Patrol: any;
      Shift: any;
      EventLog: any;
      PanicEvent: any;
      Checkpoint: any;
      Report: any;
      Checklist: any;
      Document: any;
    }>
  | 'all';

export type AppAbility = PureAbility<
  [PermActions, PermissionResource],
  PrismaQuery
>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

// ========================================
// PERMISSÕES CENTRALIZADAS
// ========================================

// Permissões básicas de perfil
const profilePermissions = {
  ownProfile: (user: User, { can }: any) => {
    can('read', 'User', { companyId: user.companyId });
    can('update', 'User', ['profilePicture'], { id: user.id });
  },

  ownProfileExtended: (user: User, { can }: any) => {
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });
  },
};

const basicViewPermissions = {
  readGuardUsers: (user: User, { cannot }: any) => {
    cannot('read', 'User', {
      companyId: user.companyId,
      role: { in: [Roles.ADMIN, Roles.SYSTEM_ADMIN, Roles.HR] },
    });
  },
};

// Permissões de recursos básicos
const basicResourcePermissions = {
  readPosts: (user: User, { can }: any) => {
    can('read', 'Post');
  },

  readVehicles: (user: User, { can }: any) => {
    can('read', 'Vehicle');
  },
};

// Permissões operacionais comuns
const operationalPermissions = {
  shiftManagement: (user: User, { can }: any) => {
    can('manage', 'Shift', { userId: user.id, companyId: user.companyId });
  },

  occurrenceManagement: (user: User, { can }: any) => {
    can('manage', 'Occurrence', { userId: user.id, companyId: user.companyId });
    can('manage', 'OccurrenceDispatch', {
      OR: [
        { userId: user.id, companyId: user.companyId },
        { guardId: user.id, companyId: user.companyId },
      ],
    });
  },

  motorizedServiceManagement: (user: User, { can }: any) => {
    can('manage', 'MotorizedService', {
      userId: user.id,
      companyId: user.companyId,
    });
  },

  supplyManagement: (user: User, { can }: any) => {
    can('manage', 'Supply', {
      userId: user.id,
      companyId: user.companyId,
    });
  },

  checklistManagement: (user: User, { can }: any) => {
    can('manage', 'VehicleChecklist', {
      userId: user.id,
      companyId: user.companyId,
    });
    can('manage', 'MotorcycleChecklist', {
      userId: user.id,
      companyId: user.companyId,
    });
    can('manage', 'DoormanChecklist', {
      userId: user.id,
      companyId: user.companyId,
    });
  },

  patrolManagement: (user: User, { can }: any) => {
    can('manage', 'Patrol', { userId: user.id, companyId: user.companyId });
  },
};

// Permissões administrativas
const administrativePermissions = {
  companyRead: (user: User, { can }: any) => {
    can('read', 'all', { companyId: user.companyId });
  },

  companyManage: (user: User, { can }: any) => {
    can(['create', 'update', 'delete'], 'all', { companyId: user.companyId });
  },

  userManagement: (user: User, { can }: any, allowedRoles: Roles[]) => {
    can(['create', 'update', 'delete'], 'User', {
      companyId: user.companyId,
      role: { in: allowedRoles },
    });
  },

  resourceManagement: (user: User, { can }: any) => {
    can('manage', 'Post', { companyId: user.companyId });
    can('manage', 'Shift', { companyId: user.companyId });
    can('manage', 'MotorizedService', { companyId: user.companyId });
  },

  reporting: (user: User, { can }: any) => {
    can('read', 'Report', { companyId: user.companyId });
    can('export', 'Report', { companyId: user.companyId });
    can('read', 'EventLog', { companyId: user.companyId });
    can('read', 'Checklist', { companyId: user.companyId });
  },
};

// Permissões específicas
const specificPermissions = {
  panicEvents: (user: User, { can }: any) => {
    can('create', 'PanicEvent', { companyId: user.companyId });
  },

  panicEventsOwn: (user: User, { can }: any) => {
    can('create', 'PanicEvent', { residentId: user.id });
    can('read', 'PanicEvent', { residentId: user.id });
  },
};

// ========================================
// MAPEAMENTO DE ROLES
// ========================================

const rolePermissionsMap = {
  // ROLES ADMINISTRATIVOS
  SYSTEM_ADMIN: (user: User, { can }: any) => {
    can('manage', 'all');
  },

  ADMIN: (user: User, { can }: any) => {
    administrativePermissions.companyRead(user, { can });
    administrativePermissions.companyManage(user, { can });
    administrativePermissions.userManagement(user, { can }, [
      Roles.ADMIN,
      Roles.SUPERVISOR,
      Roles.HR,
      Roles.GUARD,
      Roles.POST_SUPERVISOR,
      Roles.POST_RESIDENT,
      Roles.DOORMAN,
      Roles.JARDINER,
      Roles.MAINTENANCE_ASSISTANT,
      Roles.MONITORING_OPERATOR,
      Roles.ADMINISTRATIVE_ASSISTANT,
    ]);
    administrativePermissions.resourceManagement(user, { can });
    administrativePermissions.reporting(user, { can });
    specificPermissions.panicEvents(user, { can });
  },

  HR: (user: User, { can }: any) => {
    administrativePermissions.companyRead(user, { can });
    can('manage', 'User', { companyId: user.companyId });
    administrativePermissions.userManagement(user, { can }, [
      Roles.SUPERVISOR,
      Roles.HR,
      Roles.GUARD,
      Roles.POST_SUPERVISOR,
      Roles.POST_RESIDENT,
      Roles.DOORMAN,
      Roles.JARDINER,
      Roles.MAINTENANCE_ASSISTANT,
      Roles.MONITORING_OPERATOR,
      Roles.ADMINISTRATIVE_ASSISTANT,
    ]);
    can(
      'update',
      'User',
      ['name', 'email', 'phone', 'address', 'status', 'cpf'],
      {
        companyId: user.companyId,
      },
    );
  },

  // ROLES OPERACIONAIS
  SUPERVISOR: (user: User, { can, cannot }: any) => {
    administrativePermissions.companyRead(user, { can });
    cannot('read', 'User', {
      companyId: user.companyId,
      role: { in: [Roles.ADMIN, Roles.SYSTEM_ADMIN] },
    });

    profilePermissions.ownProfile(user, { can });
    operationalPermissions.shiftManagement(user, { can });
    // can('manage', 'Shift', { companyId: user.companyId });
    operationalPermissions.occurrenceManagement(user, { can });
    operationalPermissions.motorizedServiceManagement(user, { can });
    operationalPermissions.supplyManagement(user, { can });
    operationalPermissions.checklistManagement(user, { can });
    operationalPermissions.patrolManagement(user, { can });
    //TODO  avaliar se supervisor pode gerenciar todos os recursos
    // can('manage', 'Occurrence', { companyId: user.companyId });
    // can('manage', 'OccurrenceDispatch', { companyId: user.companyId });
    // can('manage', 'MotorizedService', { companyId: user.companyId });
    // can('manage', 'Supply', { companyId: user.companyId });
    // can('manage', 'VehicleChecklist', { companyId: user.companyId });
    // can('manage', 'MotorcycleChecklist', { companyId: user.companyId });
    // can('manage', 'DoormanChecklist', { companyId: user.companyId });
    // can('manage', 'Patrol', { companyId: user.companyId });
  },

  GUARD: (user: User, { can, cannot }: any) => {
    profilePermissions.ownProfile(user, { can });
    basicViewPermissions.readGuardUsers(user, { cannot });
    basicResourcePermissions.readPosts(user, { can });
    basicResourcePermissions.readVehicles(user, { can });
    operationalPermissions.shiftManagement(user, { can });
    operationalPermissions.occurrenceManagement(user, { can });
    operationalPermissions.motorizedServiceManagement(user, { can });
    operationalPermissions.supplyManagement(user, { can });
    operationalPermissions.checklistManagement(user, { can });
    operationalPermissions.patrolManagement(user, { can });
  },

  DOORMAN: (user: User, { can, cannot }: any) => {
    profilePermissions.ownProfile(user, { can });
    basicViewPermissions.readGuardUsers(user, { cannot });
    basicResourcePermissions.readPosts(user, { can });
    basicResourcePermissions.readVehicles(user, { can });
    operationalPermissions.shiftManagement(user, { can });
    operationalPermissions.occurrenceManagement(user, { can });
    can('manage', 'DoormanChecklist', {
      userId: user.id,
      companyId: user.companyId,
    });
    operationalPermissions.patrolManagement(user, { can });
  },

  ADMINISTRATIVE_ASSISTANT: (user: User, { can, cannot }: any) => {
    profilePermissions.ownProfile(user, { can });
    basicViewPermissions.readGuardUsers(user, { cannot });
    basicResourcePermissions.readPosts(user, { can });
    operationalPermissions.shiftManagement(user, { can });
    operationalPermissions.occurrenceManagement(user, { can });
  },

  JARDINER: (user: User, { can, cannot }: any) => {
    profilePermissions.ownProfile(user, { can });
    basicViewPermissions.readGuardUsers(user, { cannot });
    basicResourcePermissions.readPosts(user, { can });
    operationalPermissions.shiftManagement(user, { can });
    operationalPermissions.occurrenceManagement(user, { can });
  },

  MAINTENANCE_ASSISTANT: (user: User, { can, cannot }: any) => {
    profilePermissions.ownProfile(user, { can });
    basicViewPermissions.readGuardUsers(user, { cannot });
    basicResourcePermissions.readPosts(user, { can });
    operationalPermissions.shiftManagement(user, { can });
    operationalPermissions.occurrenceManagement(user, { can });
  },

  MONITORING_OPERATOR: (user: User, { can, cannot }: any) => {
    profilePermissions.ownProfile(user, { can });
    basicViewPermissions.readGuardUsers(user, { cannot });
    basicResourcePermissions.readPosts(user, { can });
    operationalPermissions.shiftManagement(user, { can });
    operationalPermissions.occurrenceManagement(user, { can });
  },

  // ROLES ESPECÍFICOS DE POSTO
  POST_SUPERVISOR: (user: User, { can, cannot }: any) => {
    profilePermissions.ownProfileExtended(user, { can });
    basicViewPermissions.readGuardUsers(user, { cannot });
    operationalPermissions.shiftManagement(user, { can });
    operationalPermissions.occurrenceManagement(user, { can });
    operationalPermissions.motorizedServiceManagement(user, { can });
    can('manage', 'VehicleChecklist', {
      userId: user.id,
      companyId: user.companyId,
    });
    can('manage', 'MotorcycleChecklist', {
      userId: user.id,
      companyId: user.companyId,
    });
  },

  POST_RESIDENT: (user: User, { can }: any) => {
    profilePermissions.ownProfileExtended(user, { can });
    specificPermissions.panicEventsOwn(user, { can });
  },
};

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

    // Aplica permissões baseadas no role
    rolePermissionsMap[user.role](user, builder);

    this.ability = builder.build();
    return this.ability;
  }

  // Método auxiliar para verificar permissões específicas
  hasPermission(user: User, permissionType: PermissionType): boolean {
    const userWithPermissions = user as UserWithPermissions;
    return (
      userWithPermissions.permissions?.some(
        (p) => p.permissionType === permissionType && p.granted,
      ) ?? false
    );
  }
}
