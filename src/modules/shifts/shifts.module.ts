import { Module } from '@nestjs/common'; 
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { PostsModule } from '../posts/posts.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [PostsModule, ReportsModule],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService]
})
export class ShiftsModule {}
