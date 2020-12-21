import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
})
export class AdminPanelModule implements OnApplicationBootstrap {
  constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}

  onApplicationBootstrap() {
    const { httpAdapter } = this._httpAdapterHost;
    const app = httpAdapter.getInstance();

    const jsonParserIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === 'jsonParser',
    );
    const jsonParser = app._router.stack.splice(jsonParserIndex, 1);

    const urlencodedParserIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === 'urlencodedParser',
    );
    const urlencodedParser = app._router.stack.splice(urlencodedParserIndex, 1);

    const adminIndex = app._router.stack.findIndex(
      (layer: { regexp: RegExp }) => layer.regexp.toString().includes('admin'),
    );
    const admin = app._router.stack.splice(adminIndex, 1);

    // if admin-bro-nestjs didn't reorder the middleware
    // the body parser would have come after corsMiddleware
    const corsIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === 'corsMiddleware',
    );

    app._router.stack.splice(
      corsIndex + 1,
      0,
      ...admin,
      ...jsonParser,
      ...urlencodedParser,
    );
  }
}
