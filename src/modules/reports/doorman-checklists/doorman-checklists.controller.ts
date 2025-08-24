import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { DoormanChecklistsService } from './doorman-checklists.service';
import { CreateDoormanChecklistDto } from './dto/create-doorman-checklist.dto';
import { UpdateDoormanChecklistDto } from './dto/update-doorman-checklist.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(TenantInterceptor)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR)
@Controller('doorman-checklists')
export class DoormanChecklistsController extends UniversalController<
  CreateDoormanChecklistDto,
  UpdateDoormanChecklistDto,
  DoormanChecklistsService
> {
  constructor(service: DoormanChecklistsService) {
    super(service); 
  }
}
