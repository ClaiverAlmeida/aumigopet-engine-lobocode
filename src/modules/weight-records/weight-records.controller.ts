import { Controller, UseGuards } from '@nestjs/common';
import { WeightRecordsService } from './weight-records.service';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpdateWeightRecordDto } from './dto/update-weight-record.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
})
@Controller('weight-records')
export class WeightRecordsController extends UniversalController<
  CreateWeightRecordDto,
  UpdateWeightRecordDto,
  WeightRecordsService
> {
  constructor(service: WeightRecordsService) {
    super(service);
  }
}
