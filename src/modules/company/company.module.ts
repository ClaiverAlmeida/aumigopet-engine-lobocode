import { Module } from '@nestjs/common'; 
import { CompanyService } from './company.service';

@Module({
  // controllers: [CompanyController],
  providers: [CompanyService], 
  exports: [CompanyService]
})
export class CompanyModule {}
