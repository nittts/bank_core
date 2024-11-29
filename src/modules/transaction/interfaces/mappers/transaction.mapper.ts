import { Account } from '../../../account/domain/account.entity';
import { Transaction } from '../../domain/transaction.entity';
import { CreateWithdrawalDTO } from '../dtos/create-withdrawal.dto';
import { TransactionModel } from '../../infrastructure/transaction.model';
import { CreateDepositDTO } from '../dtos/create-deposit.dto';
import { CreateInternalDTO } from '../dtos/create-internal.dto';
import { TransactionResponseDTO } from '../dtos/transaction-response.dto';
import { AccountMapper } from '../../../account/interfaces/mappers/account.mapper';

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
      sender.id,
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
      receiver.id,
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
      sender.id,
      receiver.id,
      new Date(),
      new Date(),
    );
  }

  toPersistence(transaction: Transaction) {
    return {
      type: transaction.type,
      amount: transaction.amount,
      sender_id: transaction.sender_id,
      receiver_id: transaction.receiver_id,
    };
  }

  toDomain(transactionModel: TransactionModel) {
    return new Transaction(
      transactionModel.id,
      transactionModel.type,
      transactionModel.amount,
      transactionModel.sender_id,
      transactionModel.receiver_id,
      transactionModel.createdAt,
      transactionModel.updatedAt,
    );
  }

  toDTO(transaction: Transaction) {
    return new TransactionResponseDTO(transaction);
  }
}
