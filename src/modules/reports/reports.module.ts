import { Module } from '@nestjs/common';
import { OccurrencesController } from './occurrences/occurrences.controller';
import { OccurrencesService } from './occurrences/occurrences.service';
import { VehicleChecklistsController } from './vehicle-checklists/vehicle-checklists.controller';
import { VehicleChecklistsService } from './vehicle-checklists/vehicle-checklists.service';
import { SuppliesController } from './supplies/supplies.controller';
import { SuppliesService } from './supplies/supplies.service';
import { MotorizedServicesController } from './motorized-services/motorized-service.controller';
import { MotorizedServicesService } from './motorized-services/motorized-service.service';
import { OccurrencesDispatchesController } from './occurrence-dispatch/occurrences-dispatches.controller';
import { OccurrencesDispatchesService } from './occurrence-dispatch/occurrences-dispatches.service';
import { DoormanChecklistsController } from './doorman-checklists/doorman-checklists.controller';
import { DoormanChecklistsService } from './doorman-checklists/doorman-checklists.service';

@Module({
  controllers: [
    OccurrencesController,
    VehicleChecklistsController,
    SuppliesController,
    MotorizedServicesController,
    OccurrencesDispatchesController,
    DoormanChecklistsController,
  ],
  providers: [
    OccurrencesService,
    VehicleChecklistsService,
    SuppliesService,
    MotorizedServicesService,
    OccurrencesDispatchesService,
    DoormanChecklistsService,
  ],
  exports: [
    OccurrencesService,
    VehicleChecklistsService,
    SuppliesService,
    MotorizedServicesService,
    OccurrencesDispatchesService,
    DoormanChecklistsService,
  ],
})
export class ReportsModule {}
