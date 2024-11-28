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
import { Op } from 'sequelize';

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

  async findById(id: number) {
    const persistedTransaction = await this.transactionModel.findByPk(id);

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
      });

      const persistedAccount = await this.accountModel.findByPk(
        payload.sender_id,
        {
          transaction: t,
        },
      );
      const domainAccount = this.accountMapper.toDomain(persistedAccount);

      const previousBalance = { senderBalance: domainAccount.getBalance() };
      decrementBalance(domainAccount);

      await persistedAccount.update(
        { balance: domainAccount.getBalance() },
        { transaction: t },
      );

      this.logger.log(
        `Finished Withdrawal - Account: ${domainAccount.number} - from ${previousBalance.senderBalance} to ${domainAccount.getBalance()} - id: ${persistedTransaction.id}`,
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
        payload.receiver_id,
        { transaction: t },
      );

      const domainAccount = this.accountMapper.toDomain(persistedAccount);

      const previousBalance = { receiverBalance: domainAccount.getBalance() };
      incrementBalance(domainAccount);

      await persistedAccount.update(
        { balance: domainAccount.getBalance() },
        { transaction: t },
      );

      this.logger.log(
        `Finished Deposit - Account: ${domainAccount.number} - from ${previousBalance.receiverBalance} to ${domainAccount.getBalance()} - id: ${persistedTransaction.id}`,
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
      });

      const sender = await this.accountModel.findByPk(payload.sender_id, {
        transaction: t,
      });
      const domainSender = this.accountMapper.toDomain(sender);

      const receiver = await this.accountModel.findByPk(payload.receiver_id, {
        transaction: t,
      });
      const domainReceiver = this.accountMapper.toDomain(receiver);

      const previousBalances = {
        senderBalance: domainSender.getBalance(),
        receiverBalance: domainReceiver.getBalance(),
      };
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
        `Finished Transaction - Sender: ${sender.number} - from ${previousBalances.senderBalance} to ${domainSender.getBalance()} | Receiver: ${receiver.number} - from ${previousBalances.receiverBalance} to ${domainReceiver.getBalance()} - id: ${persistedTransaction.id}`,
      );

      return this.transactionMapper.toDomain(persistedTransaction);
    }, 10);
  }

  async findByAccountId(id: number) {
    const transactions = await this.transactionModel.findAll({
      where: { [Op.or]: [{ sender_id: id }, { receiver_id: id }] },
      include: [
        {
          model: AccountModel,
          foreignKey: 'sender_id',
          as: 'sender',
          required: false,
        },
        {
          model: AccountModel,
          as: 'receiver',
          foreignKey: 'receiver_id',
          required: false,
        },
      ],
    });

    return transactions.map((transactionModel) => {
      const transaction = this.transactionMapper.toDomain(transactionModel);

      transaction.referenceReceiver(
        this.accountMapper.toDomain(transactionModel.receiver),
      );
      transaction.referenceSender(
        this.accountMapper.toDomain(transactionModel.sender),
      );

      return transaction;
    });
  }
}
