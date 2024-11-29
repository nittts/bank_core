import { BadRequestException, Injectable } from '@nestjs/common';

import { ITransactionRepository } from '../domain/transaction.repository';
import { TransactionMapper } from '../interfaces/mappers/transaction.mapper';

import { IAccountRepository } from '../../account/domain/account.repository';

import { InsuficientFundsException } from '../../../shared/exceptions/insuficient-funds.exception';
import { InvalidAccountException } from '../../../shared/exceptions/invalid-account.exception';

import { CreateWithdrawalDTO } from '../interfaces/dtos/create-withdrawal.dto';
import { CreateDepositDTO } from '../interfaces/dtos/create-deposit.dto';
import { CreateInternalDTO } from '../interfaces/dtos/create-internal.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  async performWithDrawal(createWithdrawalDTO: CreateWithdrawalDTO) {
    const { number, amount } = createWithdrawalDTO;

    const sender = await this.accountRepository.findByNumber(number);

    if (!sender) {
      throw new InvalidAccountException('Sender account not found');
    }

    if (!sender.isActive()) {
      throw new InvalidAccountException('Sender account not active');
    }

    if (!sender.hasEnoughFunds(amount)) {
      throw new InsuficientFundsException();
    }

    const newTransaction = this.transactionMapper.toCreateWithDrawal(
      createWithdrawalDTO,
      sender,
    );

    const persistedTransaction =
      await this.transactionRepository.performWithdrawal(
        newTransaction,
        (sender) => sender.decrementBalance(amount),
      );

    return this.transactionMapper.toDTO(persistedTransaction);
  }

  async performDeposit(createDepositDTO: CreateDepositDTO) {
    const { number, amount } = createDepositDTO;

    const receiver = await this.accountRepository.findByNumber(number);

    if (!receiver) {
      throw new InvalidAccountException('Receiver account not found');
    }

    if (!receiver.isActive()) {
      throw new InvalidAccountException('Receiver account not active');
    }

    const newTransaction = this.transactionMapper.toCreateDeposit(
      createDepositDTO,
      receiver,
    );

    const persistedTransaction =
      await this.transactionRepository.performDeposit(
        newTransaction,
        (receiver) => receiver.incrementBalance(amount),
      );

    return this.transactionMapper.toDTO(persistedTransaction);
  }

  async performInternal(createInternalDTO: CreateInternalDTO) {
    const { receiverNumber, amount, senderNumber } = createInternalDTO;

    const sender = await this.accountRepository.findByNumber(senderNumber);
    if (!sender) {
      throw new InvalidAccountException('Sender Account not found');
    }

    if (!sender.isActive()) {
      throw new InvalidAccountException('Sender Account not active');
    }

    console.log(sender, { hasFunds: sender.hasEnoughFunds(amount) });

    if (!sender.hasEnoughFunds(amount)) {
      throw new InsuficientFundsException();
    }

    const receiver = await this.accountRepository.findByNumber(receiverNumber);
    if (!receiver) {
      throw new InvalidAccountException('Receiver Account not found');
    }

    if (!receiver.isActive()) {
      throw new InvalidAccountException('Receiver Account not active');
    }

    const newTransaction = this.transactionMapper.toCreateInternal(
      createInternalDTO,
      sender,
      receiver,
    );

    const persistedTransaction =
      await this.transactionRepository.performTransaction(
        newTransaction,
        (sender, receiver) => {
          sender.decrementBalance(amount);
          receiver.incrementBalance(amount);
        },
      );

    return this.transactionMapper.toDTO(persistedTransaction);
  }

  async findTransaction(id: number, includeAccounts = true) {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) throw new BadRequestException('Transaction not Found');

    if (includeAccounts) {
      const { sender_id, receiver_id } = transaction;
      const sender = await this.accountRepository.findById(sender_id);
      transaction.referenceSender(sender);

      const receiver = await this.accountRepository.findById(receiver_id);
      transaction.referenceReceiver(receiver);
    }

    return this.transactionMapper.toDTO(transaction);
  }
}
