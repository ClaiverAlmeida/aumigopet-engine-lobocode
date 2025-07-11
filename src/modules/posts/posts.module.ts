import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';

@Module({
  // controllers: [PostController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
