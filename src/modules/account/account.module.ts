import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AccountModel } from './infrastructure/account.model';
import { AccountService } from './application/account.service';
import { IAccountRepository } from './domain/account.repository';
import { AccountRepository } from './infrastructure/account.repository';
import { AccountController } from './presentation/account.controller';

@Module({
  imports: [SequelizeModule.forFeature([AccountModel])],
  controllers: [AccountController],
  providers: [
    AccountService,
    { provide: IAccountRepository, useClass: AccountRepository },
  ],
  exports: [AccountService, IAccountRepository],
})
export class AccountModule {}
