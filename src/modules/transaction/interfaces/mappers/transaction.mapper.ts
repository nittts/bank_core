import { Account } from 'src/modules/account/domain/account.entity';
import { Transaction } from '../../domain/transaction.entity';
import { CreateWithdrawalDTO } from '../dtos/create-withdrawal.dto';
import { TransactionModel } from '../../infrastructure/transaction.model';
import { Injectable } from '@nestjs/common';
import { AccountMapper } from 'src/modules/account/interfaces/mappers/account.mapper';
import { CreateDepositDTO } from '../dtos/create-deposit.dto';
import { CreateInternalDTO } from '../dtos/create-internal.dto';

@Injectable()
export class TransactionMapper {
  constructor(private readonly accountMapper: AccountMapper) {}

  toCreateWithDrawal(
    createWithdrawalDTO: CreateWithdrawalDTO,
    sender: Account,
  ) {
    return new Transaction(
      null,
      createWithdrawalDTO.type,
      createWithdrawalDTO.amount,
      sender,
      null,
      new Date(),
      new Date(),
    );
  }

  toCreateDeposit(createDepositDTO: CreateDepositDTO, receiver: Account) {
    return new Transaction(
      null,
      createDepositDTO.type,
      createDepositDTO.amount,
      null,
      receiver,
      new Date(),
      new Date(),
    );
  }

  toCreateInternal(
    createInternalDto: CreateInternalDTO,
    sender: Account,
    receiver: Account,
  ) {
    return new Transaction(
      null,
      createInternalDto.type,
      createInternalDto.amount,
      sender,
      receiver,
      new Date(),
      new Date(),
    );
  }

  toPersistence(transaction: Transaction) {
    return {
      type: transaction.type,
      amount: transaction.amount,
      sender_id: transaction.sender ? transaction.sender.id : null,
      receiver_id: transaction.receiver ? transaction.receiver.id : null,
    };
  }

  toDomain(transactionModel: TransactionModel) {
    const { sender, receiver } = transactionModel;

    const transactionSender = sender
      ? this.accountMapper.toDomain(sender)
      : null;

    const transactionReceiver = receiver
      ? this.accountMapper.toDomain(receiver)
      : null;

    return new Transaction(
      transactionModel.id,
      transactionModel.type,
      transactionModel.amount,
      transactionSender,
      transactionReceiver,
      transactionModel.createdAt,
      transactionModel.updatedAt,
    );
  }
}
