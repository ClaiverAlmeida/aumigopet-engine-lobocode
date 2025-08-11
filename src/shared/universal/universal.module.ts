import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UniversalQueryService } from './services/query.service';
import { UniversalRepository } from './repositories/universal.repository';
import { UniversalPermissionService } from './services/permission.service';
import { UniversalAuditService } from './services/audit.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    UniversalRepository,
    UniversalQueryService,
    UniversalPermissionService,
    UniversalAuditService,
  ],
  exports: [
    UniversalRepository,
    UniversalQueryService,
    UniversalPermissionService,
    UniversalAuditService,
  ],
})
export class UniversalModule {}
