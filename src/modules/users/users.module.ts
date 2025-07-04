import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CompanyModule } from 'src/modules/company/company.module';
import { UnitModule } from '../unit/unit.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [CompanyModule, UnitModule],
})
export class UsersModule {}
