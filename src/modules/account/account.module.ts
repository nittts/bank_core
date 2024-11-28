import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AccountModel } from './infrastructure/account.model';
import { AccountService } from './application/account.service';
import { IAccountRepository } from './domain/account.repository';
import { AccountRepository } from './infrastructure/account.repository';
import { AccountController } from './interfaces/controllers/account.controller';
import { AccountMapper } from './interfaces/mappers/account.mapper';

import { CustomerModule } from '../customer/customer.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountModel]),
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
