import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common/interfaces';

import { AppModule } from '../../src/app.module';
import { AuthModule } from '../../src/auth/auth.module';
import { configureTestApp } from '../app.config.test';

let app: INestApplication;

interface MockProvider {
  provide: Injectable;
  // eslint-disable-next-line @typescript-eslint/ban-types
  useValue: object;
}

export const createApp = async (
  providers: MockProvider[] = [],
): Promise<INestApplication> => {
  const module = Test.createTestingModule({
    imports: [AppModule, AuthModule],
  });

  for (const provider of providers) {
    module.overrideProvider(provider.provide).useValue(provider.useValue);
  }

  const moduleFixture: TestingModule = await module.compile();

  app = configureTestApp(moduleFixture, app);
  await app.init();

  return app;
};
