import { Account } from '../../account/domain/account.entity';
import { TransactionType } from './enums/transaction-type.enum';

export class Transaction {
  public id: number | null;
  public type: TransactionType;
  public amount: number;

  public sender_id: number | null;
  public sender: Account | null;

  public receiver_id: number | null;
  public receiver: Account | null;

  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    type: TransactionType,
    amount: number,
    sender_id: number | null,
    receiver_id: number | null,
    createdAt: Date | null,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.sender = null;
    this.receiver = null;

    this.validate();
  }

  validateWithDrawalFields() {
    if (this.sender_id === null) throw new Error('Invalid sender');
  }

  validateDepositFields() {
    if (this.receiver_id === null) throw new Error('Invalid receiver');
  }

  validateInternalFields() {
    if (this.sender_id === null) throw new Error('Invalid sender');
    if (this.receiver_id === null) throw new Error('Invalid receiver');
  }

  validate() {
    if (this.type === TransactionType.WITHDRAWAL) {
      this.validateWithDrawalFields();
    }
    if (this.type === TransactionType.DEPOSIT) {
      this.validateDepositFields();
    }

    if (this.type === TransactionType.INTERNAL) {
      this.validateInternalFields();
    }

    if (this.amount < 0) throw new Error('Invalid Transaction amount');
  }

  referenceSender(sender: Account) {
    this.sender = sender;
  }

  referenceReceiver(receiver: Account) {
    this.receiver = receiver;
  }
}
