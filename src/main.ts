// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import Environment from './config/environment';
import AdminBro from 'admin-bro';
import { Database, Resource } from '@admin-bro/typeorm';
import { validate } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires

const isEnvironment = (environment: Environment): boolean =>
  process.env.NODE_ENV === environment;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);

  if (!isEnvironment(Environment.TEST)) {
    Resource.validate = validate;
    AdminBro.registerAdapter({ Database, Resource });
  }
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const options = new DocumentBuilder()
    .setTitle('Shop example')
    .setDescription('The shop API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
