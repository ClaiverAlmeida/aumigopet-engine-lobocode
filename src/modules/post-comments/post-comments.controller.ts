import { Controller, UseGuards } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER, Roles.SERVICE_PROVIDER],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.USER],
})
@Controller('post-comments')
export class PostCommentsController extends UniversalController<
  CreatePostCommentDto,
  UpdatePostCommentDto,
  PostCommentsService
> {
  constructor(service: PostCommentsService) {
    super(service);
  }
}
