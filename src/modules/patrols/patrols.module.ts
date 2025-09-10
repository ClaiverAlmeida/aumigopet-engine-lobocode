import { Module } from '@nestjs/common'; 
import { PatrolsService } from './patrols.service';
import { PatrolsController } from './patrols.controller';
import { PostsModule } from '../posts/posts.module';
import { ShiftsModule } from '../shifts/shifts.module';

@Module({ imports: [PostsModule, ShiftsModule],
  controllers: [PatrolsController],
  providers: [PatrolsService],
  exports: [PatrolsService]
})
export class PatrolsModule {}
