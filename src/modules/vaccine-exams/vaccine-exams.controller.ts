import { Controller, UseGuards } from '@nestjs/common';
import { VaccineExamsService } from './vaccine-exams.service';
import { CreateVaccineExamDto } from './dto/create-vaccine-exam.dto';
import { UpdateVaccineExamDto } from './dto/update-vaccine-exam.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
  POST: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
  PATCH: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
  DELETE: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
})
@Controller('vaccine-exams')
export class VaccineExamsController extends UniversalController<
  CreateVaccineExamDto,
  UpdateVaccineExamDto,
  VaccineExamsService
> {
  constructor(service: VaccineExamsService) {
    super(service);
  }
}
