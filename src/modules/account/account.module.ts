import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AccountModel } from './infrastructure/account.model';
import { AccountService } from './application/account.service';
import { IAccountRepository } from './domain/account.repository';
import { AccountRepository } from './infrastructure/account.repository';
import { AccountController } from './interfaces/controllers/account.controller';
import { AccountMapper } from './interfaces/mappers/account.mapper';

import { CustomerModel } from '../customer/infrastructure/customer.model';
import { CustomerModule } from '../customer/customer.module';

import { TransactionModel } from '../transaction/infrastructure/transaction.model';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountModel, CustomerModel, TransactionModel]),
    forwardRef(() => CustomerModule),
    forwardRef(() => TransactionModule),
  ],
  controllers: [AccountController],
  providers: [
    AccountMapper,
    AccountService,
    { provide: IAccountRepository, useClass: AccountRepository },
  ],
  exports: [AccountService, IAccountRepository, AccountMapper],
})
export class AccountModule {}
