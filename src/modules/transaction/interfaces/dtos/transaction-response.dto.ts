import { AccountResponseDTO } from 'src/modules/account/interfaces/dtos/account-response.dto';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { Transaction } from '../../domain/transaction.entity';

export class TransactionResponseDTO {
  public id: number;
  public type: TransactionType;
  public amount: number;
  public receiver_id: number;
  public sender_id: number;

  public receiver: AccountResponseDTO | null;
  public sender: AccountResponseDTO | null;

  public createdAt: Date;
  public updatedAt: Date;

  constructor(transaction: Transaction) {
    const { receiver, sender } = transaction;

    this.id = transaction.id;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.receiver_id = transaction.receiver_id;
    this.sender_id = transaction.sender_id;
    this.receiver = receiver ? new AccountResponseDTO(receiver) : null;
    this.sender = sender ? new AccountResponseDTO(sender) : null;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
