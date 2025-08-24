import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { OccurrencesDispatchesService } from './occurrences-dispatches.service';
import { CreateOccurrenceDispatchDto } from './dto/create-occurrences-dispatches.dto';
import { UpdateOccurrenceDispatchDto } from './dto/update-occurrences-dispatches.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.SUPERVISOR, Roles.GUARD)
@Controller('occurrences-dispatches')
export class OccurrencesDispatchesController extends UniversalController<
  CreateOccurrenceDispatchDto,
  UpdateOccurrenceDispatchDto,
  OccurrencesDispatchesService
> {
  constructor(service: OccurrencesDispatchesService) {
    super(service);
  }
}
