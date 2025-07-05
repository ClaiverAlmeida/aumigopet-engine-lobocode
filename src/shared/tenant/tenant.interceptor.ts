import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantService } from './tenant.service';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityService } from '../casl/casl-ability/casl-ability.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private tenantService: TenantService,
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
    const request = context.switchToHttp().getRequest();
      const user = this.extractUserFromRequest(request);

      // Valida se usuário tem empresa (exceto PLATFORM_ADMIN)
      this.validateUserHasCompany(user);
      
      // Configura tenant baseado no contexto (body ou query)
      await this.setupTenantContext(request, user);
      
      return next.handle();
    } catch (error) {
      this.handleTenantError(error);
    }
  }

  // Extrair usuário da requisição
  protected extractUserFromRequest(request: any) {
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    return user;
  }

  // Validar se usuário tem empresa (exceto master)
  private validateUserHasCompany(user: any): void {
    const ability = this.abilityService.ability;
    
    // Verifica se usuário pode acessar dados globais (PLATFORM_ADMIN)
    if (ability.can('manage', 'all')) {
      return;
    }

    if (!user.companyId) {
      throw new ForbiddenException('User does not have a company');
    }
  }

  // Configurar contexto do tenant baseado no request
  private async setupTenantContext(request: any, user: any): Promise<void> {
    const ability = this.abilityService.ability;
    const body = request.body;
    const query = request.query;

    // Verifica se PLATFORM_ADMIN especificou companyId (body ou query)
    const specifiedCompanyId = body?.companyId || query?.companyId;

    if (specifiedCompanyId) {
      // Valida se apenas PLATFORM_ADMIN pode especificar companyId
      if (!ability.can('manage', 'all')) {
        throw new ForbiddenException(
          'Only platform administrators can specify companyId in requests'
        );
      }

      // Busca e valida empresa especificada
      const company = await this.findAndValidateCompany(specifiedCompanyId);
      this.tenantService.setTemporaryTenant(company.id, company.name);
    } else {
      // Usa tenant padrão do usuário
      const company = await this.findAndValidateCompany(user);
      this.tenantService.setTenant(company);
    }
  }

  // Buscar e validar empresa no banco
  private async findAndValidateCompany(companyIdOrUser: any) {
    const ability = this.abilityService.ability;
    
    // Se for PLATFORM_ADMIN sem especificar companyId, retorna tenant global
    if (ability.can('manage', 'all') && typeof companyIdOrUser !== 'string') {
      return { id: 'global', name: 'Global Tenant', isGlobal: true };
    }

    // Se for string (companyId), busca empresa específica
    if (typeof companyIdOrUser === 'string') {
      const company = await this.prismaService.company.findFirst({
        where: { id: companyIdOrUser },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      return { ...company, isGlobal: false };
    }

    // Se for user, busca empresa do usuário
    const company = await this.prismaService.company.findFirst({
      where: { id: companyIdOrUser.companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return { ...company, isGlobal: false };
    }

  // Tratar erros de tenant de forma padronizada
  private handleTenantError(error: any): never {
    console.error('Tenant error:', error);

    if (
      error instanceof ForbiddenException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    throw new ForbiddenException('Tenant configuration failed');
  }

  // Método protegido para extensão (Open/Closed Principle)
  protected getTenantExtractionStrategy(): 'company' | 'subdomain' | 'custom' {
    return 'company';
  }
}
