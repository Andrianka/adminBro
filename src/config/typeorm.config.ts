require('dotenv').config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT),
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrationsRun: true,
  synchronize: true,
  logging: 'all',
};
