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
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.SYSTEM_ADMIN)
@Controller('companies')
export class CompaniesController {
  private readonly entityName = 'company';

  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  buscarComPaginacao(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.companiesService.buscarComPaginacao(page, limit);
  }

  @Get('all')
  buscarTodos() {
    return this.companiesService.buscarTodos(this.entityName);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.companiesService.buscarPorId(id);
  }

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
