// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import Environment from './config/environment';
import AdminBro from 'admin-bro';
import { Database, Resource } from '@admin-bro/typeorm';
import { validate } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-var-requires

const isEnvironment = (environment: Environment): boolean =>
  process.env.NODE_ENV === environment;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  if (!isEnvironment(Environment.TEST)) {
    Resource.validate = validate;
    AdminBro.registerAdapter({ Database, Resource });
  }

  await app.listen(3000);
}
bootstrap();
