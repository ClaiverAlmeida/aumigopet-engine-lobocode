import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';

@Module({
  // controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService],
})
export class UnitModule {}
