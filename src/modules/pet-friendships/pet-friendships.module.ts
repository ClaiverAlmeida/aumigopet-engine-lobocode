import { Module } from '@nestjs/common';
import { PetFriendshipsService } from './pet-friendships.service';
import { PetFriendshipsController } from './pet-friendships.controller';
import { UniversalModule } from 'src/shared/universal/universal.module';

@Module({
  imports: [UniversalModule], 
  controllers: [PetFriendshipsController],
  providers: [PetFriendshipsService],
  exports: [PetFriendshipsService],
})
export class PetFriendshipsModule {}
