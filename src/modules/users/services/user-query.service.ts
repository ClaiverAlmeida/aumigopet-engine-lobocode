import { Injectable } from '@nestjs/common';
import { CaslAbilityService } from '../../../shared/casl/casl-ability/casl-ability.service';
import { TenantService } from '../../../shared/tenant/tenant.service';
import { accessibleBy } from '@casl/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserQueryService {
  constructor(
    private abilityService: CaslAbilityService,
    private tenantService: TenantService,
  ) {}

  buildWhereClause(baseWhere: Prisma.UserWhereInput = {}): Prisma.UserWhereInput {
    const ability = this.abilityService.ability;
    const tenant = this.tenantService.getTenant();

    const whereClause: Prisma.UserWhereInput = {
      ...baseWhere,
      AND: [accessibleBy(ability, 'read').User],
    };

    // Se não for tenant global, filtra por companyId
    if (!tenant.isGlobal) {
      whereClause.companyId = tenant.id;
    }

    return whereClause;
  }

  buildWhereClauseForUpdate(id: string): Prisma.UserWhereInput {
    const tenant = this.tenantService.getTenant();
    const whereClause: Prisma.UserWhereInput = { id };

    // Se não for tenant global, filtra por companyId
    if (!tenant.isGlobal) {
      whereClause.companyId = tenant.id;
    }

    return whereClause;
  }

  canPerformAction(action: 'read' | 'update' | 'delete'): boolean {
    const ability = this.abilityService.ability;
    return ability.can(action, 'User');
  }

  canUpdateFields(user: any, updateData: any): boolean {
    const ability = this.abilityService.ability;
    return ability.can('update', { ...user, ...updateData });
  }
} 