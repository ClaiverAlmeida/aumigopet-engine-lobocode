import { Module } from '@nestjs/common'; 
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService]
})
export class ShiftsModule {}
