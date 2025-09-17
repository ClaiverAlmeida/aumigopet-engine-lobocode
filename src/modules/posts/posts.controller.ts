import { Controller, Get, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { UniversalController } from 'src/shared/universal/index';

@UseGuards(AuthGuard, RoleGuard)
@RequiredRoles(Roles.SYSTEM_ADMIN, Roles.ADMIN)
@Controller('posts')
export class PostsController extends UniversalController<
  CreatePostDto,
  UpdatePostDto,
  PostsService
> {
  constructor(service: PostsService) {
    super(service);
  }

  @RequiredRoles(Roles.GUARD, Roles.SUPERVISOR, Roles.DOORMAN, Roles.JARDINER, Roles.MAINTENANCE_ASSISTANT, Roles.MONITORING_OPERATOR, Roles.ADMINISTRATIVE_ASSISTANT)
  @Get('all')
  async buscarTodos() {
    return this.service.buscarTodos();
  }
}
