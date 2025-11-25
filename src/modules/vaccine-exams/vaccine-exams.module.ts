import { Module } from '@nestjs/common';
import { VaccineExamsService } from './vaccine-exams.service';
import { VaccineExamsController } from './vaccine-exams.controller';
import { UniversalModule } from 'src/shared/universal/universal.module';

@Module({
  imports: [UniversalModule], 
  controllers: [VaccineExamsController],
  providers: [VaccineExamsService],
  exports: [VaccineExamsService],
})
export class VaccineExamsModule {}
