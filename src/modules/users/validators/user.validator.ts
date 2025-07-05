import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CompaniesService } from '../../companies/companies.service';
import { UnitsService } from '../../units/units.service';
import { ConflictError, NotFoundError, ValidationError } from '../../../shared/common/errors';

@Injectable()
export class UserValidator {
  constructor(
    private userRepository: UserRepository,
    private companiesService: CompaniesService,
    private unitsService: UnitsService,
  ) {}

  async validateEmailUnique(email: string, excludeUserId?: string) {
    const user = await this.userRepository.findUnique({ email });
    if (user && user.id !== excludeUserId) {
      throw new ConflictError('Email already exists');
    }
  }

  async validateCompanyExists(companyId: string) {
    await this.companiesService.validateExists(companyId);
  }

  async validateUnitBelongsToCompany(unitId: string, companyId: string) {
    await this.unitsService.validateBelongsToCompany(unitId, companyId);
  }

  async validateUserExists(id: string) {
    const user = await this.userRepository.findUnique({ id });
    if (!user) {
      throw new NotFoundError('User', id, 'id');
    }
    return user;
  }

  async validateUserCanBeDeleted(id: string) {
    const userWithRelations = await this.userRepository.findWithRelations(id);
    
    if (userWithRelations && userWithRelations.rounds && userWithRelations.rounds.length > 0) {
      throw new ValidationError('Cannot delete user with active rounds');
    }
    
    if (userWithRelations && userWithRelations.shifts && userWithRelations.shifts.length > 0) {
      throw new ValidationError('Cannot delete user with active shifts');
    }
  }
} 