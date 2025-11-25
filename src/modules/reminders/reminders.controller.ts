import { Controller, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
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
@Controller('reminders')
export class RemindersController extends UniversalController<
  CreateReminderDto,
  UpdateReminderDto,
  RemindersService
> {
  constructor(service: RemindersService) {
    super(service);
  }
}
