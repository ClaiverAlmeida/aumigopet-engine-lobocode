import { Injectable } from '@nestjs/common'; 
import { NotFoundError, ValidationError } from 'src/shared/common/errors';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.unit.findUnique({ where: { id } });
  }

  async validateExists(id: string) {
    const unit = await this.getById(id);
    if (!unit) {
      throw new NotFoundError('Unit', id, 'id');
    }
    return unit;
  }

  async validateBelongsToCompany(unitId: string, companyId: string) {
    const unit = await this.getById(unitId);
    if (!unit) {
      throw new NotFoundError('Unit', unitId, 'id');
    }
    if (unit.companyId !== companyId) {
      throw new ValidationError('Unit does not belong to the specified company');
    }
    return unit;
  }

  // Adicione outros métodos conforme necessário
} 