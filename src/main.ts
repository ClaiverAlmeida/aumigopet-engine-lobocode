import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module'; 
import { CustomLoggerService } from './shared/common/logger/logger.service';
import { MetricsInterceptor } from './shared/common/interceptors/metrics.interceptor';

async function bootstrap() {
  try { 

    const app = await NestFactory.create(AppModule);
    const logger = app.get(CustomLoggerService);

    app.enableCors({
      origin: [
        'https://appinfraseg.com',
        'https://appinfraseg.com',
        'http://localhost:4200',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false,
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
