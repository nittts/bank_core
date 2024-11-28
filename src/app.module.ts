import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { ConfigureModule } from './shared/infrastructure/config.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    CustomerModule,
    AccountModule,
    TransactionModule,
    DatabaseModule,
    ConfigureModule,
  ],
})
export class AppModule {}
