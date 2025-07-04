import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CaslAbilityService } from '../../shared/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  ForbiddenError,
} from '../../shared/common/errors';
import { CompanyService } from '../company/company.service';
import { UnitService } from '../unit/unit.service';
import { CreatePlatformAdminDto } from './dto/create-platform-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateGuardDto } from './dto/create-guard.dto';
import { CreateHRDto } from './dto/create-hr.dto';
import { CreateResidentDto } from './dto/create-resident.dto';
import { Roles } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
    private companyService: CompanyService,
    private unitService: UnitService,
  ) {}

  private async validateEmailUnique(email: string, excludeUserId?: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user && user.id !== excludeUserId) {
      throw new ConflictError('Email already exists');
    }
  }

  async getAll() {
    const ability = this.abilityService.ability;
    if (!ability.can('read', 'User')) {
      throw new ForbiddenError('You do not have permission to read users');
    }
    return this.prismaService.user.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').User],
      },
      include: {
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
      },
    });
  }

  async getById(id: string) {
    const ability = this.abilityService.ability;
    if (!ability.can('read', 'User')) {
      throw new ForbiddenError('You do not have permission to read users');
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'read').User],
      },
      include: {
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
      },
    });

    if (!user) {
      throw new NotFoundError('User', id, 'id');
    }

    return user;
  }

  async createPlatformAdmin(dto: CreatePlatformAdminDto) {
    await this.validateEmailUnique(dto.email);
    return this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: bcrypt.hashSync(dto.password, 10),
        role: Roles.PLATFORM_ADMIN,
      },
    });
  }

  async createAdmin(dto: CreateAdminDto) {
    await this.validateEmailUnique(dto.email);
    await this.companyService.validateExists(dto.companyId);
    return this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: bcrypt.hashSync(dto.password, 10),
        role: Roles.ADMIN,
        companyId: dto.companyId,
      },
    });
  }

  async createGuard(dto: CreateGuardDto) {
    await this.validateEmailUnique(dto.email);
    await this.companyService.validateExists(dto.companyId);
    for (const unitId of dto.unitIds) {
      await this.unitService.validateBelongsToCompany(unitId, dto.companyId);
    }
    const user = await this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: bcrypt.hashSync(dto.password, 10),
        role: Roles.GUARD,
        companyId: dto.companyId,
      },
    });
    for (const unitId of dto.unitIds) {
      await this.prismaService.unit.update({
        where: { id: unitId },
        data: {
          guards: {
            connect: { id: user.id },
          },
        },
      });
    }
    return user;
  }

  async createHR(dto: CreateHRDto) {
    await this.validateEmailUnique(dto.email);
    await this.companyService.validateExists(dto.companyId);
    return this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: bcrypt.hashSync(dto.password, 10),
        role: Roles.HR,
        companyId: dto.companyId,
      },
    });
  }

  async createResident(dto: CreateResidentDto) {
    await this.validateEmailUnique(dto.email);
    await this.companyService.validateExists(dto.companyId);
    await this.unitService.validateBelongsToCompany(dto.unitId, dto.companyId);
    return this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: bcrypt.hashSync(dto.password, 10),
        role: Roles.RESIDENT,
        companyId: dto.companyId,
        unitId: dto.unitId,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const ability = this.abilityService.ability;
    if (!ability.can('update', 'User')) {
      throw new ForbiddenError('You do not have permission to update users');
    }
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundError('User', id, 'id');
    }

    const updateData: any = {};
    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.profilePicture)
      updateData.profilePicture = updateUserDto.profilePicture;
    if (updateUserDto.active !== undefined)
      updateData.active = updateUserDto.active;

    if (!ability.can('update', { ...existingUser, ...updateData })) {
      throw new ForbiddenError(
        'You do not have permission to update these fields',
      );
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateData,
      include: {
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
      },
    });
  }

  async remove(id: string) {
    const ability = this.abilityService.ability;
    if (!ability.can('delete', 'User')) {
      throw new ForbiddenError('You do not have permission to delete users');
    }
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundError('User', id, 'id');
    }
    const userWithRelations = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        rounds: true,
        shifts: true,
        eventLogs: true,
        panicEvents: true,
      },
    });
    if (userWithRelations && userWithRelations.rounds.length > 0) {
      throw new ValidationError('Cannot delete user with active rounds');
    }
    if (userWithRelations && userWithRelations.shifts.length > 0) {
      throw new ValidationError('Cannot delete user with active shifts');
    }
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
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
      },
    });
  }

  async findByCompany(companyId: string) {
    const ability = this.abilityService.ability;
    if (!ability.can('read', 'User')) {
      throw new ForbiddenError('You do not have permission to read users');
    }
    return this.prismaService.user.findMany({
      where: {
        companyId,
        AND: [accessibleBy(ability, 'read').User],
      },
      include: {
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByUnit(unitId: string) {
    const ability = this.abilityService.ability;
    if (!ability.can('read', 'User')) {
      throw new ForbiddenError('You do not have permission to read users');
    }
    return this.prismaService.user.findMany({
      where: {
        unitId,
        AND: [accessibleBy(ability, 'read').User],
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
