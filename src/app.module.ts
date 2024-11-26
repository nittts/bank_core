import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { DatabaseModule } from './config/database.module';
import { ConfigureModule } from './config/config.module';

@Module({
  imports: [ModulesModule, DatabaseModule, ConfigureModule],
})
export class AppModule {}
