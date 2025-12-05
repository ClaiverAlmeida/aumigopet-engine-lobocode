import { Controller, UseGuards } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { UpdatePostLikeDto } from './dto/update-post-like.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
})
@Controller('post-likes')
export class PostLikesController extends UniversalController<
  CreatePostLikeDto,
  UpdatePostLikeDto,
  PostLikesService
> {
  constructor(service: PostLikesService) {
    super(service);
  }
}
