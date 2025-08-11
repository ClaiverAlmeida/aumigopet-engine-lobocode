import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { CrudAction } from 'src/shared/common/types';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
// @RequiredRoles(Roles.SYSTEM_ADMIN)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // ============================================================================
  // 📖 ENDPOINTS BÁSICOS DE LEITURA 
  // ============================================================================

  @Get()
  buscarComPaginacao(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.companiesService.buscarComPaginacao(page, limit);
  }

  @Get('all')
  buscarTodos() {
    return this.companiesService.buscarTodos();
  }

  // ============================================================================
  // 📊 ENDPOINTS DE AUDITORIA E MÉTRICAS (ANTES DO :id)
  // ============================================================================

  @Get('metrics')
  @RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN)
  obterMetricas(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: CrudAction,
  ) {
    const periodo = startDate && endDate ? {
      inicio: new Date(startDate),
      fim: new Date(endDate),
    } : undefined;

    const filtrosAdicionais = {
      ...(userId && { userId }),
      ...(action && { action }),
    };

    return this.companiesService.obterMetricas(periodo, filtrosAdicionais);
  }

  @Get('logs')
  @RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN)
  obterLogs(
    @Query('limit') limit: number = 100,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: CrudAction,
    @Query('success') success?: boolean,
  ) {
    const periodo = startDate && endDate ? {
      inicio: new Date(startDate),
      fim: new Date(endDate),
    } : undefined;

    const filtrosAdicionais = {
      ...(userId && { userId }),
      ...(action && { action }),
      ...(success !== undefined && { success }),
    };

    return this.companiesService.obterLogs(limit, periodo, filtrosAdicionais);
  }

  @Get('logs/failures')
  @RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN)
  obterLogsFalhas(
    @Query('limit') limit: number = 50,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const periodo = startDate && endDate ? {
      inicio: new Date(startDate),
      fim: new Date(endDate),
    } : undefined;

    return this.companiesService.obterLogsFalhas(limit, periodo);
  }

  @Get('analytics/usage')
  @RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN)
  obterEstatisticasDeUso(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const periodo = startDate && endDate ? {
      inicio: new Date(startDate),
      fim: new Date(endDate),
    } : undefined;

    return this.companiesService.obterEstatisticasDeUso(periodo);
  }

  @Get('export/logs')
  @RequiredRoles(Roles.SYSTEM_ADMIN)
  exportarLogs(
    @Query('format') formato: 'json' | 'csv' = 'json',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: CrudAction,
    @Query('success') success?: boolean,
  ) {
    const periodo = startDate && endDate ? {
      inicio: new Date(startDate),
      fim: new Date(endDate),
    } : undefined;

    const filtrosAdicionais = {
      ...(userId && { userId }),
      ...(action && { action }),
      ...(success !== undefined && { success }),
    };

    return this.companiesService.exportarLogs(formato, periodo, filtrosAdicionais);
  }

  // ============================================================================
  // 🔍 ENDPOINTS DE BUSCA ESPECIALIZADA
  // ============================================================================

  @Get('search/cnpj/:cnpj')
  buscarPorCNPJ(@Param('cnpj') cnpj: string) {
    return this.companiesService.buscarPorCampo('cnpj', cnpj);
  }

  @Get('search/name')
  buscarPorNome(@Query('name') name: string) {
    if (!name) {
      throw new BadRequestException('Nome é obrigatório para a busca');
    }
    return this.companiesService.buscarMuitosPorCampo('name', name);
  }

  // ============================================================================
  // 📖 ENDPOINT GENÉRICO (DEVE SER O ÚLTIMO GET)
  // ============================================================================

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.companiesService.buscarPorId(id);
  }

  // ============================================================================
  // ✏️ ENDPOINTS DE ESCRITA
  // ============================================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  criar(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.criar(createCompanyDto);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.atualizar(id, updateCompanyDto);
  }

  @Delete(':id')
  desativar(@Param('id') id: string) {
    return this.companiesService.desativar(id);
  }

  @Post(':id/restore')
  reativar(@Param('id') id: string) {
    return this.companiesService.reativar(id);
  }
}