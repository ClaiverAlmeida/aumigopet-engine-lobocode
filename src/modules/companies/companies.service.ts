import { Injectable } from '@nestjs/common';
import { UniversalRepository } from '../../shared/repositories/universal.repository';
import { UniversalService } from '../../shared/services/universal.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ConflictError } from '../../shared/common/errors';

@Injectable()
export class CompaniesService extends UniversalService {
  constructor(repository: UniversalRepository) {
    super(repository, 'company');
  }

  // 🔄 Sobrescrever método criar para validar CNPJ
  async criar(createCompanyDto: CreateCompanyDto) {
    // Validar se CNPJ já existe
    const existingCompany = await this.repository.buscarPrimeiro(
      this.entityName,
      { cnpj: createCompanyDto.cnpj },
    );
    if (existingCompany) {
      throw new ConflictError('CNPJ já está em uso');
    }

    return super.criar(createCompanyDto);
  }

  // 🔄 Sobrescrever método atualizar para validar CNPJ
  async atualizar(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Se está atualizando CNPJ, validar se não existe outro com mesmo CNPJ
    if (updateCompanyDto.cnpj) {
      const existingCompany = await this.repository.buscarPrimeiro(
        this.entityName,
        { cnpj: updateCompanyDto.cnpj },
      );
      if (existingCompany && existingCompany.id !== id) {
        throw new ConflictError('CNPJ já está em uso');
      }
    }

    return super.atualizar(id, updateCompanyDto);
  }

  // 💡 Métodos específicos de Company
  async buscarPorCNPJ(cnpj: string) {
    return this.repository.buscarPrimeiro(this.entityName, { cnpj });
  }
}
