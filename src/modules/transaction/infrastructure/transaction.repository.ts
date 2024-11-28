import { InjectModel } from '@nestjs/sequelize';
import { TransactionModel } from './transaction.model';
import { AccountModel } from 'src/modules/account/infrastructure/account.model';
import { TransactionMapper } from '../interfaces/mappers/transaction.mapper';
import { ITransactionRepository } from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';
import { DatabaseService } from 'src/shared/infrastructure/database/database.service';
import { Account } from 'src/modules/account/domain/account.entity';
import { AccountMapper } from 'src/modules/account/interfaces/mappers/account.mapper';
import { Logger } from '@nestjs/common';

export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionModel)
    private transactionModel: typeof TransactionModel,
    @InjectModel(AccountModel)
    private accountModel: typeof AccountModel,

    private readonly accountMapper: AccountMapper,
    private readonly transactionMapper: TransactionMapper,
    private readonly databaseService: DatabaseService,
  ) {}

  logger = new Logger(TransactionRepository.name);

  GLOBAL_INCLUDE = [
    {
      model: this.accountModel,
      foreignKey: 'receiver_id',
      as: 'receiver',
      required: false,
    },
    {
      model: this.accountModel,
      foreignKey: 'sender_id',
      as: 'sender',
      required: false,
    },
  ];

  async findById(id: number) {
    const persistedTransaction = await this.transactionModel.findByPk(id, {
      include: this.GLOBAL_INCLUDE,
    });

    if (!persistedTransaction) return null;

    return this.transactionMapper.toDomain(persistedTransaction);
  }

  async performWithdrawal(
    transaction: Transaction,
    decrementBalance: (account: Account) => void,
  ) {
    return this.databaseService.executeTransaction<Transaction>(async (t) => {
      const payload = this.transactionMapper.toPersistence(transaction);

      const persistedTransaction = await this.transactionModel.create(payload, {
        transaction: t,
        include: this.GLOBAL_INCLUDE,
      });

      const persistedAccount = await this.accountModel.findByPk(
        transaction.sender.id,
        { transaction: t },
      );
      const domainAccount = this.accountMapper.toDomain(persistedAccount);

      persistedTransaction.sender = persistedAccount;

      decrementBalance(domainAccount);

      await persistedAccount.update(
        { balance: domainAccount.getBalance() },
        { transaction: t },
      );

      this.logger.log(
        `Finished Withdrawal - Account: ${domainAccount.number} - from ${transaction.sender.getBalance()} to ${domainAccount.getBalance()}`,
      );

      return this.transactionMapper.toDomain(persistedTransaction);
    }, 10);
  }

  async performDeposit(
    transaction: Transaction,
    incrementBalance: (account: Account) => void,
  ) {
    return this.databaseService.executeTransaction<Transaction>(async (t) => {
      const payload = this.transactionMapper.toPersistence(transaction);

      const persistedTransaction = await this.transactionModel.create(payload, {
        transaction: t,
      });

      const persistedAccount = await this.accountModel.findByPk(
        transaction.receiver.id,
        { transaction: t },
      );

      persistedTransaction.receiver = persistedAccount;

      const domainAccount = this.accountMapper.toDomain(persistedAccount);

      incrementBalance(domainAccount);

      await persistedAccount.update(
        { balance: domainAccount.getBalance() },
        { transaction: t },
      );

      this.logger.log(
        `Finished Deposit - Account: ${domainAccount.number} - from ${transaction.sender.getBalance()} to ${domainAccount.getBalance()}`,
      );

      return this.transactionMapper.toDomain(persistedTransaction);
    }, 10);
  }

  async performTransaction(
    transaction: Transaction,
    updateBalances: (sender: Account, receiver: Account) => void,
  ) {
    return this.databaseService.executeTransaction<Transaction>(async (t) => {
      const payload = this.transactionMapper.toPersistence(transaction);

      const persistedTransaction = await this.transactionModel.create(payload, {
        transaction: t,
        include: this.GLOBAL_INCLUDE,
      });

      const sender = await this.accountModel.findByPk(transaction.sender.id, {
        transaction: t,
      });
      const domainSender = this.accountMapper.toDomain(sender);

      const receiver = await this.accountModel.findByPk(
        transaction.receiver.id,
        { transaction: t },
      );
      const domainReceiver = this.accountMapper.toDomain(receiver);

      persistedTransaction.sender = sender;
      persistedTransaction.receiver = receiver;

      updateBalances(domainSender, domainReceiver);

      await sender.update(
        { balance: domainSender.getBalance() },
        { transaction: t },
      );

      await receiver.update(
        { balance: domainReceiver.getBalance() },
        { transaction: t },
      );

      this.logger.log(
        `Finished Transaction - Sender: ${sender.number} - from ${transaction.sender.getBalance()} to ${domainSender.getBalance()} | Receiver: ${receiver.number} - from ${transaction.receiver.getBalance()} to ${domainReceiver.getBalance()}`,
      );

      return this.transactionMapper.toDomain(persistedTransaction);
    }, 10);
  }
}
