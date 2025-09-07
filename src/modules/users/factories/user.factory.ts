import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Roles, UserStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreateSystemAdminDto } from '../dto/create-system-admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { CreateGuardDto } from '../dto/create-guard.dto';
import { CreateHRDto } from '../dto/create-hr.dto';
import { CreatePostResidentDto } from '../dto/create-post-resident.dto';
import { CreatePostSupervisorDto } from '../dto/create-post-supervisor.dto';
import { CreateSupervisorDto } from '../dto/create-supervisor.dto';

@Injectable()
export class UserFactory {
  private criptografarPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  criarSystemAdmin(dto: CreateSystemAdminDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login,
      email: dto.email,
      password: this.criptografarPassword(dto.password),
      role: Roles.ADMIN,
    };
  }

  criarAdmin(dto: CreateAdminDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login,
      email: dto.email,
      password: this.criptografarPassword(dto.password),
      role: Roles.ADMIN,
      company: {
        connect: { id: dto.companyId },
      },
    };
  }

  criarSupervisor(dto: CreateSupervisorDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login,
      email: dto.email,
      password: this.criptografarPassword(dto.password),
      role: Roles.SUPERVISOR,
      company: {
        connect: { id: dto.companyId },
      },
    };
  }

  criarGuard(dto: CreateGuardDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login,
      email: dto.email,
      registration: dto.registration,
      cpf: dto.cpf,
      rg: dto.rg,
      phone: dto.phone,
      address: dto.address,
      profilePicture: dto?.profilePicture,
      status: dto?.status,
      password: this.criptografarPassword(dto.password),
      role: Roles.GUARD,
      company: {
        connect: { id: dto.companyId },
      },
    };
  }

  criarHR(dto: CreateHRDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login,
      email: dto.email,
      password: this.criptografarPassword(dto.password),
      role: Roles.HR,
      company: {
        connect: { id: dto.companyId },
      },
    };
  }

  criarPostSupervisor(dto: CreatePostSupervisorDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login,
      email: dto.email,
      password: this.criptografarPassword(dto.password),
      role: Roles.POST_SUPERVISOR,
      company: {
        connect: { id: dto.companyId },
      },
    };
  }

  criarPostResident(dto: CreatePostResidentDto): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login,
      email: dto.email,
      password: this.criptografarPassword(dto.password),
      role: Roles.POST_RESIDENT,
      company: {
        connect: { id: dto.companyId },
      },
    };
  }
}
