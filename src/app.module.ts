import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

import { TypeOrmModule } from '@nestjs/typeorm/';
import { AdminModule } from '@admin-bro/nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import Environment from './config/environment';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AdminPanelModule } from './admin-panel/admin.module';
import { PhotoModule } from './photo/photo.module';
import adminOptions from './admin-panel/admin.options';
import adminAuthConfig from './admin-panel/admin-auth.config';

import { join } from 'path';

const env = process.env.NODE_ENV;

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
    }),
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(
          process.cwd(),
          env === Environment.TEST ? '.env.test' : '.env',
        ),
      ],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AdminModule.createAdmin({
      adminBroOptions: adminOptions,
      auth: adminAuthConfig,
    }),
    ProductModule,
    UserModule,
    AdminPanelModule,
    PhotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
