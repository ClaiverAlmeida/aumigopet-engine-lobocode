import { Module } from '@nestjs/common';
import { PetFriendRequestsService } from './pet-friend-requests.service';
import { PetFriendRequestsController } from './pet-friend-requests.controller';
import { UniversalModule } from 'src/shared/universal/universal.module';

@Module({
  imports: [UniversalModule], 
  controllers: [PetFriendRequestsController],
  providers: [PetFriendRequestsService],
  exports: [PetFriendRequestsService],
})
export class PetFriendRequestsModule {}
