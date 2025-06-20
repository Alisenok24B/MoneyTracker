/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3008);
  app.enableCors({ origin: true, credentials: true });
  await app.init();
  Logger.log(
    `🚀 Application is running`
  );
}

bootstrap();
