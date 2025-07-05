import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  // Includes padrão para User
  private get defaultInclude() {
    return {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      unit: {
        select: {
          id: true,
          name: true,
        },
      },
    };
  }

  // Includes para validação de relacionamentos
  private get validationInclude() {
    return {
      rounds: true,
      shifts: true,
      eventLogs: true,
      panicEvents: true,
    };
  }

  async findMany(where: Prisma.UserWhereInput, options?: { skip?: number; take?: number }, include?: Prisma.UserInclude) {
    return this.prisma.user.findMany({
      where,
      skip: options?.skip,
      take: options?.take,
      include: include || this.defaultInclude,
    });
  }

  async findFirst(where: Prisma.UserWhereInput, include?: Prisma.UserInclude) {
    return this.prisma.user.findFirst({
      where,
      include: include || this.defaultInclude,
    });
  }

  async findUnique(where: Prisma.UserWhereUniqueInput, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({
      where,
      include: include || this.defaultInclude,
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      include: this.defaultInclude,
    });
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where,
      data,
      include: this.defaultInclude,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }

  async findWithRelations(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: this.validationInclude,
    });
  }

  async connectUserToUnits(userId: string, unitIds: string[]) {
    const updates = unitIds.map(unitId =>
      this.prisma.unit.update({
        where: { id: unitId },
        data: {
          guards: {
            connect: { id: userId },
          },
        },
      })
    );

    return Promise.all(updates);
  }

  async count(where: Prisma.UserWhereInput) {
    return this.prisma.user.count({ where });
  }
} 