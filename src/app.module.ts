import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './shared/auth/auth.module';
import { CaslModule } from './shared/casl/casl.module';
import { ProductsModule } from './modules/products/products.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { TenantModule } from './shared/tenant/tenant.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from './shared/common/logger/logger.module';
import { MessagesModule } from './shared/common/messages/messages.module';
import { RateLimitMiddleware } from './shared/common/middleware/rate-limit.middleware';
import { SoftDeleteInterceptor } from './shared/interceptors/soft-delete.interceptor';

//javascript es7

@Module({
  imports: [
    LoggerModule,
    MessagesModule,
    PrometheusModule.register(),
    UsersModule,
    PrismaModule,
    AuthModule,
    ProductsModule,
    CompaniesModule,
    CaslModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SoftDeleteInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');
  }
}

//vai ficar num modulo
