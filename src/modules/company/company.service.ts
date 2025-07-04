import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotFoundError } from '../../shared/common/errors';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async validateExists(id: string) {
    const company = await this.getById(id);
    if (!company) {
      throw new NotFoundError('Company', id, 'id');
    }
    return company;
  }
}
