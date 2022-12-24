import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

// import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/\*\.ultraverse\.top/],
    },
    logger: ['error', 'warn'],
  });

  // helmet
  app.use(helmet());

  // CSRF Protection
  // app.use(csurf());

  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
