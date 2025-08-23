import { Module } from '@nestjs/common';
import { OccurrencesController } from './occurrences/occurrences.controller';
import { OccurrencesService } from './occurrences/occurrences.service';
import { VehicleChecklistsController } from './vehicle-checklists/vehicle-checklists.controller';
import { VehicleChecklistsService } from './vehicle-checklists/vehicle-checklists.service';
import { SuppliesController } from './supplies/supplies.controller';
import { SuppliesService } from './supplies/supplies.service';
import { MotorizedServicesController } from './motorized-services/motorized-service.controller';
import { MotorizedServicesService } from './motorized-services/motorized-service.service';

@Module({
  controllers: [
    OccurrencesController,
    VehicleChecklistsController,
    SuppliesController,
    MotorizedServicesController,
  ],
  providers: [
    OccurrencesService,
    VehicleChecklistsService,
    SuppliesService,
    MotorizedServicesService,
  ],
  exports: [
    OccurrencesService,
    VehicleChecklistsService,
    SuppliesService,
    MotorizedServicesService,
  ],
})
export class ReportsModule {}
