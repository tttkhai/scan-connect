import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  synchronize: false,
  migrations: [`${__dirname}/migration/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});