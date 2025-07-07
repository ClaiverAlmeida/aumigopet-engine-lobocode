import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ProductSlugAlreadyExistsErrorFilter } from './modules/products/filters/product-slug-already-exists.filter';
import { NotFoundErrorFilter } from './shared/common/filters';
import { ValidationErrorFilter } from './shared/common/filters';
import { UnauthorizedErrorFilter } from './shared/common/filters';
import { ForbiddenErrorFilter } from './shared/common/filters'; 
import { ConflictErrorFilter } from './shared/common/filters';
import { InvalidCredentialsErrorFilter } from './shared/common/filters/invalid-credentials-error.filter'; 
import { runSeed } from 'prisma/seed';
import { CustomLoggerService } from './shared/common/logger/logger.service';
import { MetricsInterceptor } from './shared/common/interceptors/metrics.interceptor';

async function bootstrap() {
  try {
    await runSeed();

    const app = await NestFactory.create(AppModule);
    const logger = app.get(CustomLoggerService);

    app.enableCors({
      origin: [
        'https://meusite.com',
        'https://app.meusite.com',
        'http://localhost:4200',
      ], // origens permitidas
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true, // permite cookies/credenciais (se usar autenticação via cookie)
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    app.useGlobalFilters(
      new ProductSlugAlreadyExistsErrorFilter(),
      new NotFoundErrorFilter(),
      new ValidationErrorFilter(),
      new UnauthorizedErrorFilter(),
      new ForbiddenErrorFilter(),
      new ConflictErrorFilter(),
      new InvalidCredentialsErrorFilter(),
    ); //tratamento de erros
    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalInterceptors(new MetricsInterceptor());

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    
    logger.log(`🚀 Aplicação iniciada na porta ${port}`, 'Bootstrap');
    logger.log(`📊 Health check disponível em http://localhost:${port}/health`, 'Bootstrap');
    logger.log(`📈 Métricas disponíveis em http://localhost:${port}/metrics`, 'Bootstrap');
  } catch (error) {
    console.error('❌ Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
}
bootstrap();
