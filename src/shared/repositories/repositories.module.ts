import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UniversalRepository } from './universal.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [UniversalRepository],
  exports: [UniversalRepository],
})
export class RepositoriesModule {}
