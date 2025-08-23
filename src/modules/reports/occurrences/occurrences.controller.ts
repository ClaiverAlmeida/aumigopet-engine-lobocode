import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { OccurrencesService } from './occurrences.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.SUPERVISOR, Roles.GUARD)
@Controller('occurrences')
export class OccurrencesController extends UniversalController<
  CreateOccurrenceDto,
  UpdateOccurrenceDto,
  OccurrencesService
> {
  constructor(service: OccurrencesService) {
    super(service);
  }
}
