import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { UserValidator } from './validators/user.validator';
import { UserQueryService } from './services/user-query.service';
import { UserFactory } from './factories/user.factory';
import { CompaniesModule } from 'src/modules/companies/companies.module';
import { UnitsModule } from '../units/units.module';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    UserValidator,
    UserQueryService,
    UserFactory,
  ],
  imports: [CompaniesModule, UnitsModule],
})
export class UsersModule {}
