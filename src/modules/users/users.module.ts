import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { UserValidator } from './validators/user.validator';
import { UserFactory } from './factories/user.factory';
import { CompaniesModule } from 'src/modules/companies/companies.module';
import { PostsModule } from '../posts/posts.module'; 

//  Novos services específicos

import {
  UserPermissionService,
  SystemAdminService,
  AdminService,
  HRService,
  SupervisorService,
  GuardService,
  PostSupervisorService,
  PostResidentService,
  UserQueryService,
} from './services';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    UserValidator,
    UserQueryService,
    UserPermissionService,
    UserFactory,

    //  Novos services específicos
    SystemAdminService,
    AdminService,
    HRService,
    SupervisorService,
    GuardService,
    PostSupervisorService,
    PostResidentService,
  ],
  imports: [CompaniesModule, PostsModule],
})
export class UsersModule {}
