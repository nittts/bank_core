import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { ConfigureModule } from './shared/infrastructure/config.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { AccessTokenGuard } from './shared/guards/access-token.guard';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    CustomerModule,
    AccountModule,
    TransactionModule,
    DatabaseModule,
    ConfigureModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
