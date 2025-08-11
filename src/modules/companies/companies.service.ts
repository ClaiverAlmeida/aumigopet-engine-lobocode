import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  UniversalService,
  UniversalRepository,
  UniversalAuditService,
} from '../../shared/universal/index';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ConflictError } from '../../shared/common/errors';
import { UniversalQueryService } from 'src/shared/universal/services/query.service';
import { UniversalPermissionService } from 'src/shared/universal/services/permission.service';
// ✨ Importar helper de mapeamento automático
import { createEntityConfig } from '../../shared/universal/types';

@Injectable({ scope: Scope.REQUEST })
export class CompaniesService extends UniversalService {
  private static readonly entityConfig = createEntityConfig('company');

  constructor(
    repository: UniversalRepository,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    auditService: UniversalAuditService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = CompaniesService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      auditService,
      request,
      model,
      casl,
    );
  }

  protected async beforeCreate(data: CreateCompanyDto): Promise<void> {
    if (data.cnpj) await this.validarCNPJ(data.cnpj);
  }

  protected async beforeUpdate(
    id: string,
    data: UpdateCompanyDto,
  ): Promise<void> {
    if (data.cnpj) await this.validarCNPJ(data.cnpj);
  }

  private async validarCNPJ(cnpj: string): Promise<void> {
    const existingCompany = await this.repository.buscarPrimeiro(
      this.entityName,
      { cnpj },
    );
    if (existingCompany) {
      throw new ConflictError('CNPJ já está em uso');
    }
  }
}
