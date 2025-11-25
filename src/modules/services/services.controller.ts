import { Controller, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
  POST: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.SERVICE_PROVIDER],
  PATCH: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.SERVICE_PROVIDER],
  DELETE: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.SERVICE_PROVIDER],
})
@Controller('services')
export class ServicesController extends UniversalController<
  CreateServiceDto,
  UpdateServiceDto,
  ServicesService
> {
  constructor(service: ServicesService) {
    super(service);
  }
}
