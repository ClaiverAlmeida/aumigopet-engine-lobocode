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

async function bootstrap() {
  await runSeed();

  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
