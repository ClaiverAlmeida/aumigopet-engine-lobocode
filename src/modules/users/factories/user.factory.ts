import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Roles } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreatePlatformAdminDto } from '../dto/create-platform-admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { CreateGuardDto } from '../dto/create-guard.dto';
import { CreateHRDto } from '../dto/create-hr.dto';
import { CreateResidentDto } from '../dto/create-resident.dto';

@Injectable()
export class UserFactory {
  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  createPlatformAdmin(dto: CreatePlatformAdminDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.password),
      role: Roles.PLATFORM_ADMIN,
    };
  }

  createAdmin(dto: CreateAdminDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.password),
      role: Roles.ADMIN,
      company: {
        connect: { id: dto.companyId }
      },
    };
  }

  createGuard(dto: CreateGuardDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.password),
      role: Roles.GUARD,
      company: {
        connect: { id: dto.companyId }
      },
    };
  }

  createHR(dto: CreateHRDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.password),
      role: Roles.HR,
      company: {
        connect: { id: dto.companyId }
      },
    };
  }

  createResident(dto: CreateResidentDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.password),
      role: Roles.RESIDENT,
      company: {
        connect: { id: dto.companyId }
      },
      unit: dto.unitId ? {
        connect: { id: dto.unitId }
      } : undefined,
    };
  }
} 