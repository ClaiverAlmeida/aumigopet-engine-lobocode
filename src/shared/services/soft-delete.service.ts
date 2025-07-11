import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/messages';

@Injectable()
export class SoftDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  async softDelete(modelName: string, id: string) {
    try {
      const result = await this.prisma[modelName].update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      return {
        message: SUCCESS_MESSAGES.CRUD.DELETED,
        data: result
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(ERROR_MESSAGES.RESOURCE.NOT_FOUND);
      }
      throw error;
    }
  }

  async restore(modelName: string, id: string) {
    try {
      const result = await this.prisma[modelName].update({
        where: { id },
        data: { deletedAt: null }
      });

      return {
        message: SUCCESS_MESSAGES.CRUD.RESTORED,
        data: result
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(ERROR_MESSAGES.RESOURCE.NOT_FOUND);
      }
      throw error;
    }
  }

  async findWithDeleted(modelName: string, where: any = {}) {
    return this.prisma[modelName].findMany({
      where,
      include: {
        deletedAt: true
      }
    });
  }

  async findOnlyDeleted(modelName: string, where: any = {}) {
    return this.prisma[modelName].findMany({
      where: {
        ...where,
        deletedAt: { not: null }
      }
    });
  }
} 