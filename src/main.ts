import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';

// import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/\.ultraverse\.top/],
    },
    logger: ['error', 'warn'],
  });

  // helmet
  app
    .use(helmet())
    .use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }))
    .useGlobalPipes(new ValidationPipe())
    .useGlobalFilters(new HttpExceptionFilter())
    // 全局拦截器
    .useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());

  // CSRF Protection
  // app.use(csurf());

  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
