import { Controller, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
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
@Controller('reviews')
export class ReviewsController extends UniversalController<
  CreateReviewDto,
  UpdateReviewDto,
  ReviewsService
> {
  constructor(service: ReviewsService) {
    super(service);
  }
}
