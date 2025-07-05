import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';

@Module({
  // controllers: [UnitController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
