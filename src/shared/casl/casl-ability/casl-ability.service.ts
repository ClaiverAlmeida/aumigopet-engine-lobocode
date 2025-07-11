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

const rolePermissionsMap: Record<Roles, DefinePermissions> = {
  // ADMIN (Empresa) - Super usuário
  SYSTEM_ADMIN(user, { can }) {
    can('manage', 'all');
  },

  // ADMIN (Cliente) - Representante do cliente
  ADMIN(user, { can }) {
    // Visualização total dos dados do próprio tenant
    can('read', 'all', { companyId: user.companyId });

    //  CORRIGIDO: ADMIN só pode criar usuários de roles inferiores
    can('create', 'User', {
      companyId: user.companyId,
      role: {
        in: ['SUPERVISOR', 'HR', 'GUARD', 'POST_SUPERVISOR', 'POST_RESIDENT'],
      },
    });
    can('read', 'User', { companyId: user.companyId });

    //  MELHORADO: ADMIN só pode atualizar usuários de roles inferiores
    can('update', 'User', {
      companyId: user.companyId,
      role: {
        in: ['SUPERVISOR', 'HR', 'GUARD', 'POST_SUPERVISOR', 'POST_RESIDENT'],
      },
    });

    // Relatórios e ocorrências do posto
    can('read', 'Report', { companyId: user.companyId });
    can('export', 'Report', { companyId: user.companyId });
    can('read', 'EventLog', { companyId: user.companyId });
    can('read', 'Checklist', { companyId: user.companyId });

    // Botão de pânico
    can('create', 'PanicEvent', { companyId: user.companyId });

    // Solicitações
    can('create', 'Notification', { companyId: user.companyId });
  },

  // RH - Gestão de pessoas e documentos
  HR(user, { can }) {
    //  CORRIGIDO: HR pode gerenciar HR, SUPERVISOR e GUARD
    can('manage', 'User', {
      companyId: user.companyId,
      role: { in: ['HR', 'SUPERVISOR', 'GUARD'] },
    });

    //  MELHORADO: HR pode atualizar campos específicos de usuários
    can(
      'update',
      'User',
      ['name', 'email', 'phone', 'address', 'status', 'cpf'],
      {
        companyId: user.companyId,
        role: { in: ['HR', 'SUPERVISOR', 'GUARD'] },
      },
    );

    // Documentos de RH
    can('manage', 'Document', { companyId: user.companyId });

    // Notificações em massa
    can('create', 'Notification', { companyId: user.companyId });
    can('read', 'Notification', { companyId: user.companyId });

    // Relatórios de RH
    can('read', 'Report', { companyId: user.companyId, type: 'HR' });
    can('export', 'Report', { companyId: user.companyId, type: 'HR' });
  },

  // SUPERVISOR - Supervisor de Guardas
  SUPERVISOR(user, { can }) {
    // Tudo que um Guarda faz
    can('create', 'Shift', { companyId: user.companyId });
    can('read', 'Shift', { companyId: user.companyId });
    can('update', 'Shift', { companyId: user.companyId });

    can('create', 'Round', { companyId: user.companyId });
    can('read', 'Round', { companyId: user.companyId });
    can('update', 'Round', { companyId: user.companyId });
    can('cancel', 'Round', { companyId: user.companyId }); // Pode cancelar rondas

    can('create', 'EventLog', { companyId: user.companyId });
    can('read', 'EventLog', { companyId: user.companyId });
    can('approve', 'EventLog', { companyId: user.companyId });

    can('create', 'Report', { companyId: user.companyId });
    can('read', 'Report', { companyId: user.companyId });
    can('export', 'Report', { companyId: user.companyId });

    can('create', 'Checklist', { companyId: user.companyId });
    can('read', 'Checklist', { companyId: user.companyId });

    //  CORRIGIDO: SUPERVISOR só pode gerenciar guardas
    can('read', 'User', { companyId: user.companyId, role: 'GUARD' });
    can('update', 'User', ['name', 'email', 'phone', 'address', 'status'], {
      companyId: user.companyId,
      role: 'GUARD',
    });

    // Recebe alertas de pânico
    can('read', 'PanicEvent', { companyId: user.companyId });
    can('update', 'PanicEvent', { companyId: user.companyId });

    // Assina documentos
    can('update', 'Document', { companyId: user.companyId, type: 'SIGNATURE' });
  },

  // POST_SUPERVISOR - Supervisor de Posto
  POST_SUPERVISOR(user, { can }) {
    // Tudo que um Guarda faz
    can('create', 'Shift', { companyId: user.companyId });
    can('read', 'Shift', { companyId: user.companyId });
    can('update', 'Shift', { companyId: user.companyId });

    can('create', 'Round', { companyId: user.companyId });
    can('read', 'Round', { companyId: user.companyId });
    can('update', 'Round', { companyId: user.companyId });
    can('cancel', 'Round', { companyId: user.companyId }); // Pode cancelar rondas

    can('create', 'EventLog', { companyId: user.companyId });
    can('read', 'EventLog', { companyId: user.companyId });
    can('approve', 'EventLog', { companyId: user.companyId });

    can('create', 'Report', { companyId: user.companyId });
    can('read', 'Report', { companyId: user.companyId });
    can('export', 'Report', { companyId: user.companyId });

    can('create', 'Checklist', { companyId: user.companyId });
    can('read', 'Checklist', { companyId: user.companyId });

    // Gestão de guardas
    can('read', 'User', { companyId: user.companyId, role: 'GUARD' });
    can('update', 'User', ['name', 'email', 'phone', 'address', 'status'], {
      companyId: user.companyId,
      role: 'GUARD',
    });

    // Recebe alertas de pânico
    can('read', 'PanicEvent', { companyId: user.companyId });
    can('update', 'PanicEvent', { companyId: user.companyId });

    // Assina documentos
    can('update', 'Document', { companyId: user.companyId, type: 'SIGNATURE' });
  },

  // GUARD - Operador de campo (com permissões específicas)
  GUARD(user, { can }) {
    // Verificar permissões específicas do guarda
    const userWithPermissions = user as UserWithPermissions;
    const hasDoormanPermission = userWithPermissions.permissions?.some(
      (p) => p.permissionType === 'DOORMAN' && p.granted,
    );
    const hasSupportPermission = userWithPermissions.permissions?.some(
      (p) => p.permissionType === 'SUPPORT' && p.granted,
    );
    const hasPatrolPermission = userWithPermissions.permissions?.some(
      (p) => p.permissionType === 'PATROL' && p.granted,
    );

    // Turno e ponto (todos os guards)
    can('create', 'Shift', { guardId: user.id });
    can('read', 'Shift', { guardId: user.id });
    can('update', 'Shift', { guardId: user.id });

    // Rondas (apenas se tem permissão PATROL)
    if (hasPatrolPermission) {
      can('create', 'Round', { guardId: user.id });
      can('read', 'Round', { guardId: user.id });
      can('update', 'Round', { guardId: user.id });
    }

    // Ocorrências (todos os guards)
    can('create', 'EventLog', { guardId: user.id });
    can('read', 'EventLog', { guardId: user.id });

    // Relatórios (todos os guards)
    can('create', 'Report', { guardId: user.id });
    can('read', 'Report', { guardId: user.id });

    // Checklists (todos os guards)
    can('create', 'Checklist', { guardId: user.id });
    can('read', 'Checklist', { guardId: user.id });

    // Assina documentos (todos os guards)
    can('update', 'Document', { guardId: user.id, type: 'SIGNATURE' });

    // Perfil próprio
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });
  },

  // POST_RESIDENT - Morador
  POST_RESIDENT(user, { can }) {
    // Botão de pânico
    can('create', 'PanicEvent', { residentId: user.id });
    can('read', 'PanicEvent', { residentId: user.id });

    // Perfil próprio
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });

    // Visualiza avisos do posto
    can('read', 'Notification', { companyId: user.companyId, type: 'PUBLIC' });
  },

  // @deprecated - Roles temporários, remover em breve
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
