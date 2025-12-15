import { Module } from '@nestjs/common';
import { SharedTutorsService } from './shared-tutors.service';
import { SharedTutorsController } from './shared-tutors.controller';
import { UniversalModule } from 'src/shared/universal/universal.module';

@Module({
  imports: [UniversalModule],
  controllers: [SharedTutorsController],
  providers: [SharedTutorsService],
  exports: [SharedTutorsService],
})
export class SharedTutorsModule {}

