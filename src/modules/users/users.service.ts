import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenError, NotFoundError } from '../../shared/common/errors';
import { CreatePlatformAdminDto } from './dto/create-platform-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateGuardDto } from './dto/create-guard.dto';
import { CreateHRDto } from './dto/create-hr.dto';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UserRepository } from './repositories/user.repository';
import { UserValidator } from './validators/user.validator';
import { UserQueryService } from './services/user-query.service';
import { UserFactory } from './factories/user.factory';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private userValidator: UserValidator,
    private userQueryService: UserQueryService,
    private userFactory: UserFactory,
  ) {}

  async getAll(page = 1, limit = 20) {
    if (!this.userQueryService.canPerformAction('read')) {
      throw new ForbiddenError('You do not have permission to read users');
    }

    const whereClause = this.userQueryService.buildWhereClause();
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.findMany(whereClause, { skip, take: limit }),
      this.userRepository.count(whereClause),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    if (!this.userQueryService.canPerformAction('read')) {
      throw new ForbiddenError('You do not have permission to read users');
    }

    const whereClause = this.userQueryService.buildWhereClause({ id });
    const user = await this.userRepository.findFirst(whereClause);

    if (!user) {
      throw new NotFoundError('User', id, 'id');
    }

    return user;
  }

  async createPlatformAdmin(dto: CreatePlatformAdminDto) {
    await this.userValidator.validateEmailUnique(dto.email);
    const userData = this.userFactory.createPlatformAdmin(dto);
    return this.userRepository.create(userData);
  }

  async createAdmin(dto: CreateAdminDto) {
    await this.userValidator.validateEmailUnique(dto.email);
    await this.userValidator.validateCompanyExists(dto.companyId);
    const userData = this.userFactory.createAdmin(dto);
    return this.userRepository.create(userData);
  }

  async createGuard(dto: CreateGuardDto) {
    await this.userValidator.validateEmailUnique(dto.email);
    await this.userValidator.validateCompanyExists(dto.companyId);
    
    for (const unitId of dto.unitIds) {
      await this.userValidator.validateUnitBelongsToCompany(unitId, dto.companyId);
    }
    
    const userData = this.userFactory.createGuard(dto);
    const user = await this.userRepository.create(userData);
    
    await this.userRepository.connectUserToUnits(user.id, dto.unitIds);
    return user;
  }

  async createHR(dto: CreateHRDto) {
    await this.userValidator.validateEmailUnique(dto.email);
    await this.userValidator.validateCompanyExists(dto.companyId);
    const userData = this.userFactory.createHR(dto);
    return this.userRepository.create(userData);
  }

  async createResident(dto: CreateResidentDto) {
    await this.userValidator.validateEmailUnique(dto.email);
    await this.userValidator.validateCompanyExists(dto.companyId);
    await this.userValidator.validateUnitBelongsToCompany(dto.unitId, dto.companyId);
    const userData = this.userFactory.createResident(dto);
    return this.userRepository.create(userData);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!this.userQueryService.canPerformAction('update')) {
      throw new ForbiddenError('You do not have permission to update users');
    }

    const whereClause = this.userQueryService.buildWhereClauseForUpdate(id);
    const existingUser = await this.userRepository.findFirst(whereClause);

    if (!existingUser) {
      throw new NotFoundError('User', id, 'id');
    }

    const updateData: any = {};
    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.profilePicture)
      updateData.profilePicture = updateUserDto.profilePicture;
    if (updateUserDto.active !== undefined)
      updateData.active = updateUserDto.active;

    if (!this.userQueryService.canUpdateFields(existingUser, updateData)) {
      throw new ForbiddenError(
        'You do not have permission to update these fields',
      );
    }

    return this.userRepository.update({ id }, updateData);
  }

  async remove(id: string) {
    if (!this.userQueryService.canPerformAction('delete')) {
      throw new ForbiddenError('You do not have permission to delete users');
    }

    const whereClause = this.userQueryService.buildWhereClauseForUpdate(id);
    const existingUser = await this.userRepository.findFirst(whereClause);

    if (!existingUser) {
      throw new NotFoundError('User', id, 'id');
    }

    await this.userValidator.validateUserCanBeDeleted(id);
    return this.userRepository.delete({ id });
  }

  async findByEmail(email: string) {
    return this.userRepository.findUnique({ email });
  }

  async findByCompany(companyId: string) {
    if (!this.userQueryService.canPerformAction('read')) {
      throw new ForbiddenError('You do not have permission to read users');
    }
    
    const whereClause = this.userQueryService.buildWhereClause({ companyId });
    return this.userRepository.findMany(whereClause);
  }

  async findByUnit(unitId: string) {
    if (!this.userQueryService.canPerformAction('read')) {
      throw new ForbiddenError('You do not have permission to read users');
    }
    
    const whereClause = this.userQueryService.buildWhereClause({ unitId });
    return this.userRepository.findMany(whereClause);
  }
}
