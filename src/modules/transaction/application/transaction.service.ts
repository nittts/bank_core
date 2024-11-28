import { BadRequestException, Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../domain/transaction.repository';
import { AccountService } from 'src/modules/account/application/account.service';
import { TransactionMapper } from '../interfaces/mappers/transaction.mapper';
import { InsuficientFundsException } from 'src/shared/exceptions/insuficient-funds.exception';
import { InvalidAccountException } from 'src/shared/exceptions/invalid-account.exception';
import { CreateWithdrawalDTO } from '../interfaces/dtos/create-withdrawal.dto';
import { CreateDepositDTO } from '../interfaces/dtos/create-deposit.dto';
import { CreateInternalDTO } from '../interfaces/dtos/create-internal.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountService: AccountService,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  async performWithDrawal(createWithdrawalDTO: CreateWithdrawalDTO) {
    const { number, amount } = createWithdrawalDTO;

    const sender = await this.accountService.findByNumber(number);

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

    return await this.transactionRepository.performWithdrawal(
      newTransaction,
      (sender) => sender.decrementBalance(amount),
    );
  }

  async performDeposit(createDepositDTO: CreateDepositDTO) {
    const { number, amount } = createDepositDTO;

    const receiver = await this.accountService.findByNumber(number);

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

    return await this.transactionRepository.performDeposit(
      newTransaction,
      (receiver) => receiver.incrementBalance(amount),
    );
  }

  async performInternal(createInternalDTO: CreateInternalDTO) {
    const { receiverNumber, amount, senderNumber } = createInternalDTO;

    const sender = await this.accountService.findByNumber(senderNumber);
    if (!sender) {
      throw new InvalidAccountException('Sender Account not found');
    }

    if (!sender.isActive()) {
      throw new InvalidAccountException('Sender account not active');
    }

    if (!sender.hasEnoughFunds(amount)) {
      throw new InsuficientFundsException();
    }

    const receiver = await this.accountService.findByNumber(receiverNumber);
    if (!receiver) {
      throw new InvalidAccountException('Receiver Account not found');
    }

    if (!receiver.isActive()) {
      throw new InvalidAccountException('Receiver account not active');
    }

    const newTransaction = this.transactionMapper.toCreateInternal(
      createInternalDTO,
      sender,
      receiver,
    );

    return await this.transactionRepository.performTransaction(
      newTransaction,
      (sender, receiver) => {
        sender.decrementBalance(amount);
        receiver.incrementBalance(amount);
      },
    );
  }

  async findTransaction(id: number) {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) throw new BadRequestException('Transaction not Found');

    return transaction;
  }
}
