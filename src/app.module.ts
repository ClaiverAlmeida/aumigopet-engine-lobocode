import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './shared/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CaslModule } from './shared/casl/casl.module';
import { ProductsModule } from './modules/products/products.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { TenantModule } from './shared/tenant/tenant.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

//javascript es7

@Module({
  imports: [
    PrometheusModule.register(),
    UsersModule,
    PrismaModule,
    AuthModule,
    PostsModule,
    ProductsModule,
    CompaniesModule,
    CaslModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//vai ficar num modulo
