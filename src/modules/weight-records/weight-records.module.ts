import { Module } from '@nestjs/common';
import { WeightRecordsService } from './weight-records.service';
import { WeightRecordsController } from './weight-records.controller';
import { UniversalModule } from 'src/shared/universal/universal.module';

@Module({
  imports: [UniversalModule], 
  controllers: [WeightRecordsController],
  providers: [WeightRecordsService],
  exports: [WeightRecordsService],
})
export class WeightRecordsModule {}
