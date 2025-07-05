import { Injectable, Scope } from '@nestjs/common';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { $Enums, Post, Roles, User } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type PermissionResource =
  | Subjects<{
      User: User;
      Post: Post;
      Unit: any;
      Round: any;
      Shift: any;
      EventLog: any;
      PanicEvent: any;
      Checkpoint: any;
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
  PLATFORM_ADMIN(user, { can }) {
    can('manage', 'all');
  },
  ADMIN(user, { can }) {
    // ADMIN pode gerenciar tudo, mas apenas no próprio tenant
    can('manage', 'all', { companyId: user.companyId });

    // Permissões específicas para maior clareza
    can('create', 'User', { companyId: user.companyId });
    can('read', 'User', { companyId: user.companyId });
    can('update', 'User', { companyId: user.companyId });
    can('delete', 'User', { companyId: user.companyId });

    can('create', 'Post', { companyId: user.companyId });
    can('read', 'Post', { companyId: user.companyId });
    can('update', 'Post', { companyId: user.companyId });
    can('delete', 'Post', { companyId: user.companyId });
  },

  HR(user, { can }) {
    // ADMIN pode gerenciar tudo, mas apenas no próprio tenant
    can('read', 'all', { companyId: user.companyId });

    // Permissões específicas para maior clareza
    can('create', 'User', { companyId: user.companyId });
    can('read', 'User', { companyId: user.companyId });
    can('update', 'User', { companyId: user.companyId });
    can('delete', 'User', { companyId: user.companyId });

    can('create', 'Post', { companyId: user.companyId });
    can('read', 'Post', { companyId: user.companyId });
    can('update', 'Post', { companyId: user.companyId });
    can('delete', 'Post', { companyId: user.companyId });
  },
  GUARD(user, { can }) {
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });
  },
  RESIDENT(user, { can }) {
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });
  },
  SUPERVISION(user, { can }) {
    can('read', 'User', { id: user.id });
    can('update', 'User', ['name', 'profilePicture'], { id: user.id });
  },
  // TODO remover
  WRITER(user, { can }) {
    can('update', 'User', ['name', 'profilePicture']);
    can('create', 'Post');
    can('read', 'Post', { authorId: user.id });
    can('update', 'Post', { authorId: user.id });
  },
  READER(user, { can }) {
    can('read', 'Post', { published: true });
  },
  EDITOR(user, { can }) {
    can('update', 'User', ['name', 'profilePicture']);
    can('create', 'Post');
    can('read', 'Post');
    can('update', 'Post');
  },
};

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

    // Garante que user.permissions é um array antes de iterar
    if (Array.isArray(user.permissions)) {
      user.permissions.forEach((permission: any) => {
        builder.can(
          permission.action,
          permission.resource,
          permission.condition,
        );
      });
    }

    rolePermissionsMap[user.role](user, builder);
    this.ability = builder.build();
    return this.ability;
  }
}

//new CaslAbilityService().createForUser().can('create', 'Post'); // true

//rbac
//abac
//acl - action control list (s3)
