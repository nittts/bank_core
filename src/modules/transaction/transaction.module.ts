import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AccountModel } from '../account/infrastructure/account.model';
import { AccountModule } from '../account/account.module';

import { TransactionModel } from './infrastructure/transaction.model';
import { TransactionController } from './interfaces/controllers/transaction.controller';
import { TransactionMapper } from './interfaces/mappers/transaction.mapper';
import { TransactionService } from './application/transaction.service';
import { ITransactionRepository } from './domain/transaction.repository';
import { TransactionRepository } from './infrastructure/transaction.repository';

import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountModel, TransactionModel]),
    forwardRef(() => AccountModule),
    DatabaseModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionMapper,
    TransactionService,
    { provide: ITransactionRepository, useClass: TransactionRepository },
  ],
  exports: [TransactionMapper, TransactionService, ITransactionRepository],
})
export class TransactionModule {}
