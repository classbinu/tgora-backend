import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(process.env.PORT);
}
bootstrap();
