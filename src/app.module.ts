import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database.module';
import { ConfigureModule } from './shared/infrastructure/config.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [CustomerModule, AccountModule, DatabaseModule, ConfigureModule],
})
export class AppModule {}
