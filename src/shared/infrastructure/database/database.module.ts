import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from './database.service';
import { Sequelize } from 'sequelize-typescript';

const _SequelizeModule = SequelizeModule.forRootAsync({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    uri: config.get('DATABASE_URI'),
    dialect: config.get('DATABASE_DIALECT') ?? 'postgres',
    autoLoadModels: true,
    synchronize: config.get('NODE_ENV') === 'production' ? false : true,
  }),
});

@Module({
  imports: [_SequelizeModule],
  providers: [
    {
      provide: DatabaseService,
      useFactory: (sequelize: Sequelize) => new DatabaseService(sequelize),
      inject: [Sequelize],
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
