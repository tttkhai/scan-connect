import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  synchronize: false,
  entities: ['src/v1/**/*.entity.ts'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
  logging: ['error'],
  logger: 'file',
});
