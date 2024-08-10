import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'scan-connect',
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  synchronize: false,
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
};

export default registerAs('database', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);