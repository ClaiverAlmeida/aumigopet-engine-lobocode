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
  Notification,
  SharedTutor
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
      SharedTutor: SharedTutor;
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
// 🔐 MAPEAMENTO DE ROLES
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
   * Acesso apenas aos próprios dados e dados compartilhados
   */
  USER: (user: User, { can }: any) => {
    const userId = user.id;

    // User: pode ver e gerenciar apenas seu próprio perfil
    can('manage', 'User', { id: userId });

    // Pet: pode ver se é owner OU se é tutor compartilhado (status ACCEPTED)
    can('read', 'Pet', {
      OR: [
        { ownerId: userId },
        {
          sharedTutors: {
            some: {
              sharedTutor: {
                sharedUserId: userId,
                status: 'ACCEPTED',
                deletedAt: null,
              },
            },
          },
        },
      ],
    });
    can('create', 'Pet', { ownerId: userId });
    can('update', 'Pet', { ownerId: userId });
    can('delete', 'Pet', { ownerId: userId });

    // VaccineExam: pode ver se o pet pertence ao usuário OU se é tutor compartilhado
    can('read', 'VaccineExam', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('create', 'VaccineExam', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('update', 'VaccineExam', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('delete', 'VaccineExam', {
      pet: { ownerId: userId },
    });

    // Reminder: pode ver se o pet pertence ao usuário OU se é tutor compartilhado
    can('read', 'Reminder', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('create', 'Reminder', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('update', 'Reminder', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('delete', 'Reminder', {
      pet: { ownerId: userId },
    });

    // WeightRecord: pode ver se o pet pertence ao usuário OU se é tutor compartilhado
    can('read', 'WeightRecord', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('create', 'WeightRecord', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('update', 'WeightRecord', {
      pet: {
        OR: [
          { ownerId: userId },
          {
            sharedTutors: {
              some: {
                sharedTutor: {
                  sharedUserId: userId,
                  status: 'ACCEPTED',
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
    });
    can('delete', 'WeightRecord', {
      pet: { ownerId: userId },
    });

    // SharedTutor: pode ver se é owner OU se é o usuário compartilhado OU se foi convidado por email
    // Nota: A verificação de inviteEmail será feita no serviço, pois CASL Prisma não suporta comparação direta de strings
    can('read', 'SharedTutor', {
      OR: [
        { ownerId: userId }, 
        { sharedUserId: userId },
        // A verificação de inviteEmail será feita no serviço via where clause adicional
      ],
    });
    can('create', 'SharedTutor', { ownerId: userId });
    can('update', 'SharedTutor', {
      OR: [{ ownerId: userId }, { sharedUserId: userId }],
    });
    can('delete', 'SharedTutor', { ownerId: userId });

    // SocialPost: pode ver se é do próprio usuário OU se o pet pertence ao usuário
    can('read', 'SocialPost', {
      OR: [
        { userId: userId },
        {
          pet: {
            OR: [
              { ownerId: userId },
              {
                sharedTutors: {
                  some: {
                    sharedTutor: {
                      sharedUserId: userId,
                      status: 'ACCEPTED',
                      deletedAt: null,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    });
    can('create', 'SocialPost', { userId: userId });
    can('update', 'SocialPost', { userId: userId });
    can('delete', 'SocialPost', { userId: userId });

    // PostComment: pode ver se o post pertence ao usuário ou seus pets
    can('read', 'PostComment', {
      OR: [
        { userId: userId },
        {
          post: {
            OR: [
              { userId: userId },
              {
                pet: {
                  OR: [
                    { ownerId: userId },
                    {
                      sharedTutors: {
                        some: {
                          sharedTutor: {
                            sharedUserId: userId,
                            status: 'ACCEPTED',
                            deletedAt: null,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    can('create', 'PostComment', { userId: userId });
    can('update', 'PostComment', { userId: userId });
    can('delete', 'PostComment', { userId: userId });

    // PostLike: pode ver se o post pertence ao usuário ou seus pets
    can('read', 'PostLike', {
      OR: [
        { userId: userId },
        {
          post: {
            OR: [
              { userId: userId },
              {
                pet: {
                  OR: [
                    { ownerId: userId },
                    {
                      sharedTutors: {
                        some: {
                          sharedTutor: {
                            sharedUserId: userId,
                            status: 'ACCEPTED',
                            deletedAt: null,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    can('create', 'PostLike', { userId: userId });
    can('delete', 'PostLike', { userId: userId });

    // Outros recursos do usuário
    can('manage', 'Follow', {
      OR: [{ userId: userId }, { followingId: userId }],
    });
    can('manage', 'Favorite', { userId: userId });
    can('manage', 'Review', { userId: userId });
    can('manage', 'File', { userId: userId });
    can('manage', 'Notification', { userId: userId });
    can('manage', 'PetFriendRequest', {
      OR: [{ requesterId: userId }, { pet: { ownerId: userId } }],
    });
    can('manage', 'PetFriendship', {
      OR: [{ userId: userId }, { friendUserId: userId }],
    });
  },

  /**
   * SERVICE_PROVIDER - Prestador de serviço
   * Acesso aos próprios dados e dados de clientes
   */
  SERVICE_PROVIDER: (user: User, { can }: any) => {
    const userId = user.id;

    // Pode ver todos os pets (para prestar serviços)
    can('read', 'Pet');
    can('read', 'VaccineExam');
    can('read', 'Reminder');
    can('read', 'WeightRecord');

    // Pode gerenciar seus próprios dados
    can('manage', 'User', { id: userId });
    can('manage', 'ServiceProvider', { userId: userId });
    can('manage', 'Service', { provider: { userId: userId } });
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
