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
      Round: any;
      Shift: any;
      EventLog: any;
      PanicEvent: any;
      Checkpoint: any;
      Report: any;
      Checklist: any;
      Notification: any;
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

const rolePermissionsMap = {
  // ========================================
  // ROLES ADMINISTRATIVOS
  // ========================================

  // SYSTEM_ADMIN - Super usuário do sistema
  SYSTEM_ADMIN(user, { can }) {
    can('manage', 'all');
  },

  // ADMIN - Administrador da empresa
  ADMIN(user, { can }) {
    // Permissões gerais da empresa
    can('read', 'all', { companyId: user.companyId });
    can(['create', 'update', 'delete'], 'all', { companyId: user.companyId });

    // Gestão de usuários (exceto SYSTEM_ADMIN)
    can(['create', 'update', 'delete'], 'User', {
      companyId: user.companyId,
      role: {
        in: ['SUPERVISOR', 'HR', 'GUARD', 'POST_SUPERVISOR', 'POST_RESIDENT'],
      },
    });

    // Gestão de recursos da empresa
    can('manage', 'Post', { companyId: user.companyId });
    can('manage', 'Shift', { companyId: user.companyId });
    can('manage', 'MotorizedService', { companyId: user.companyId });

    // Relatórios e monitoramento
    can('read', 'Report', { companyId: user.companyId });
    can('export', 'Report', { companyId: user.companyId });
    can('read', 'EventLog', { companyId: user.companyId });
    can('read', 'Checklist', { companyId: user.companyId });

    // Funcionalidades específicas
    can('create', 'PanicEvent', { companyId: user.companyId });
    can('create', 'Notification', { companyId: user.companyId });
  },

  // ========================================
  // ROLES OPERACIONAIS
  // ========================================

  // HR - Recursos Humanos
  HR(user, { can, cannot }) {
    // Leitura geral da empresa
    can('read', 'all', { companyId: user.companyId });

    // Restrições de usuários
    cannot('read', 'User', {
      companyId: user.companyId,
      role: {
        in: ['ADMIN', 'SYSTEM_ADMIN', 'POST_SUPERVISOR', 'POST_RESIDENT'],
      },
    });

    // Gestão de usuários permitidos
    can('manage', 'User', {
      companyId: user.companyId,
      role: { in: ['HR', 'SUPERVISOR', 'GUARD'] },
    });
    can('update', 'User', ['name', 'email', 'phone', 'address', 'status', 'cpf'], {
      companyId: user.companyId,
      role: { in: ['HR', 'SUPERVISOR', 'GUARD'] },
    });

    // Notificações
    can('create', 'Notification', { companyId: user.companyId });
    can('read', 'Notification', { companyId: user.companyId });
  },

  // SUPERVISOR - Supervisor de Vigilantes
  SUPERVISOR(user, { can, cannot }) {
    // Leitura geral da empresa
    can('read', 'all', { companyId: user.companyId });

    // Restrições de usuários
    cannot('read', 'User', {
      companyId: user.companyId,
      role: {
        in: ['ADMIN', 'SYSTEM_ADMIN', 'HR', 'POST_SUPERVISOR', 'POST_RESIDENT'],
      },
    });

    // Perfil próprio
    can('update', 'User', ['profilePicture'], { id: user.id });

    // Gestão operacional
    can('manage', 'Shift', { userId: user.id, companyId: user.companyId });
    can('manage', 'Occurrence', { companyId: user.companyId });
    can('manage', 'MotorizedService', { companyId: user.companyId });
    can('manage', 'Supply', { companyId: user.companyId });
    can('manage', 'VehicleChecklist', { companyId: user.companyId });
  },

  // GUARD - Vigilante de Segurança
  GUARD(user, { can }) {
    // Perfil próprio
    can('read', 'User', { id: user.id });
    can('update', 'User', ['profilePicture'], { id: user.id });

    // Recursos básicos
    can('read', 'Post');
    can('read', 'Vehicle');

    // Gestão de turnos e relatórios
    can('manage', 'Shift', { userId: user.id, companyId: user.companyId });
    can('manage', 'Occurrence', { userId: user.id, companyId: user.companyId });
    can('manage', 'OccurrenceDispatch', { userId: user.id, companyId: user.companyId });
    can('manage', 'MotorizedService', { userId: user.id, companyId: user.companyId });
    can('manage', 'Supply', { userId: user.id, companyId: user.companyId });
    can('manage', 'VehicleChecklist', { userId: user.id, companyId: user.companyId });
    can('manage', 'DoormanChecklist', { userId: user.id, companyId: user.companyId });

    // TODO: Implementar permissões específicas baseadas em PermissionType
    // const userWithPermissions = user as UserWithPermissions;
    // const hasDoormanPermission = userWithPermissions.permissions?.some(
    //   (p) => p.permissionType === 'DOORMAN' && p.granted,
    // );
    // const hasSupportPermission = userWithPermissions.permissions?.some(
    //   (p) => p.permissionType === 'SUPPORT' && p.granted,
    // );
    // const hasPatrolPermission = userWithPermissions.permissions?.some(
    //   (p) => p.permissionType === 'PATROL' && p.granted,
    // );
  },
  // ========================================
  // ROLES ESPECÍFICOS DE POSTO
  // ========================================

  // POST_SUPERVISOR - Supervisor de Posto
  POST_SUPERVISOR(user, { can }) {
    // Perfil próprio
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });

    // Gestão operacional do posto
    can('manage', 'Shift', { userId: user.id, companyId: user.companyId });
    can('manage', 'Occurrence', { userId: user.id, companyId: user.companyId });
    can('manage', 'MotorizedService', { userId: user.id, companyId: user.companyId });
    can('manage', 'VehicleChecklist', { userId: user.id, companyId: user.companyId });
  },

  // POST_RESIDENT - Morador/Residente
  POST_RESIDENT(user, { can }) {
    // Perfil próprio
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });

    // Botão de pânico
    can('create', 'PanicEvent', { residentId: user.id });
    can('read', 'PanicEvent', { residentId: user.id });

    // Notificações públicas
    can('read', 'Notification', { companyId: user.companyId, type: 'PUBLIC' });
  },

  // ========================================
  // ROLES DEPRECATED (REMOVER EM BREVE)
  // ========================================

  EDITOR(user, { can }) {
    can('update', 'User', ['name', 'profilePicture']);
    can('create', 'Post');
    can('read', 'Post');
    can('update', 'Post');
  },

  WRITER(user, { can }) {
    can('update', 'User', ['name', 'profilePicture']);
    can('create', 'Post');
    can('read', 'Post', { authorId: user.id });
    can('update', 'Post', { authorId: user.id });
  },

  READER(user, { can }) {
    can('read', 'Post', { published: true });
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
