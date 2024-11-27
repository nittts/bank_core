import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AccountModel } from './infrastructure/account.model';
import { AccountService } from './application/account.service';
import { IAccountRepository } from './domain/account.repository';
import { AccountRepository } from './infrastructure/account.repository';
import { AccountController } from './presentation/account.controller';
import { CustomerModel } from '../customer/infrastructure/customer.model';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountModel, CustomerModel]),
    CustomerModule,
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    { provide: IAccountRepository, useClass: AccountRepository },
  ],
  exports: [AccountService, IAccountRepository],
})
export class AccountModule {}
