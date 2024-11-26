import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

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
})
export class DatabaseModule {}
