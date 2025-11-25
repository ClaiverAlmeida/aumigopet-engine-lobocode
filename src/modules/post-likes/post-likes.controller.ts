import { Controller, UseGuards } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { UpdatePostLikeDto } from './dto/update-post-like.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
  POST: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.SERVICE_PROVIDER],
  PATCH: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN],
  DELETE: [UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.USER],
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
