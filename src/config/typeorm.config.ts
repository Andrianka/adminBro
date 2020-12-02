require('dotenv').config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrationsRun: true,
  synchronize: true,
  logging: 'all',
};
