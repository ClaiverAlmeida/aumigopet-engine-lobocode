import { Injectable, Scope } from '@nestjs/common';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { 
  User, 
  Pet, 
  SocialPost,
  PostComment,
  PostLike,
  Follow,
  PetFriendRequest,
  PetFriendship,
  ServiceProvider,
  Service,
  VaccineExam,
  Reminder,
  WeightRecord,
  Review,
  Favorite,
  Company,
  File,
  Notification
} from '@prisma/client';

// ========================================
// 🎯 TIPOS DE AÇÕES E RECURSOS
// ========================================

export type PermActions =
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'export';

export type PermissionResource =
  | Subjects<{
      User: User;
      Company: Company;
      Pet: Pet;
      VaccineExam: VaccineExam;
      Reminder: Reminder;
      WeightRecord: WeightRecord;
      SocialPost: SocialPost;
      PostComment: PostComment;
      PostLike: PostLike;
      Follow: Follow;
      PetFriendRequest: PetFriendRequest;
      PetFriendship: PetFriendship;
      ServiceProvider: ServiceProvider;
      Service: Service;
      Review: Review;
      Favorite: Favorite;
      File: File;
      Notification: Notification;
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
// 🔐 MAPEAMENTO DE ROLES (SIMPLIFICADO)
// ========================================

const rolePermissionsMap = {
  /**
   * SYSTEM_ADMIN - Super administrador
   * Acesso total ao sistema
   */
  SYSTEM_ADMIN: (user: User, { can }: any) => {
    can('manage', 'all');
  },

  /**
   * ADMIN - Administrador
   * Acesso total ao sistema
   */
  ADMIN: (user: User, { can }: any) => {
    can('manage', 'all');
  },

  /**
   * USER - Usuário comum do app
   * Acesso total (simplificado para desenvolvimento)
   */
  USER: (user: User, { can }: any) => {
    can('manage', 'all');
  },

  /**
   * SERVICE_PROVIDER - Prestador de serviço
   * Acesso total (simplificado para desenvolvimento)
   */
  SERVICE_PROVIDER: (user: User, { can }: any) => {
    can('manage', 'all');
  },
};

// ========================================
// 🛠️ SERVIÇO CASL
// ========================================

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
  ability: AppAbility;

  /**
   * Cria as permissões para um usuário baseado em seu role
   */
  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

    // Aplica permissões baseadas no role
    const roleHandler = rolePermissionsMap[user.role];
    
    if (roleHandler) {
      roleHandler(user, builder);
    } else {
      // Fallback: se o role não existir, dá acesso total
      builder.can('manage', 'all');
    }

    this.ability = builder.build();
    return this.ability;
  }

  /**
   * Método auxiliar para verificar se o usuário tem uma permissão específica
   */
  can(action: PermActions, subject: PermissionResource): boolean {
    return this.ability?.can(action, subject) ?? false;
  }

  /**
   * Método auxiliar para verificar se o usuário NÃO tem uma permissão específica
   */
  cannot(action: PermActions, subject: PermissionResource): boolean {
    return this.ability?.cannot(action, subject) ?? true;
  }
}
