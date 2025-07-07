import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
import { LoggerModule } from './shared/common/logger/logger.module';
import { RateLimitMiddleware } from './shared/common/middleware/rate-limit.middleware';

//javascript es7

@Module({
  imports: [
    LoggerModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');
  }
}

//vai ficar num modulo
