/* eslint-disable no-param-reassign */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

export const configureTestApp = (
  moduleFixture: TestingModule,
  app: INestApplication,
): INestApplication => {
  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  return app;
};
