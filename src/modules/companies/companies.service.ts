import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotFoundError } from '../../shared/common/errors';

@Injectable()
export class CompaniesService {
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

  async findAll() {
    return this.prisma.company.findMany();
  }

  async create(createCompanyDto: any) {
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async update(id: string, updateCompanyDto: any) {
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
