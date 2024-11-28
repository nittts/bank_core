import { Account } from 'src/modules/account/domain/account.entity';
import { TransactionType } from './enums/transaction-type.enum';

export class Transaction {
  public id: number | null;
  public type: TransactionType;
  public amount: number;

  public sender: Account | null;
  public receiver: Account | null;

  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    type: TransactionType,
    amount: number,
    sender: Account | null,
    receiver: Account | null,
    createdAt: Date | null,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.sender = sender;
    this.receiver = receiver;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validateWithDrawalFields() {
    let invalid = false;

    if (this.sender === null) invalid = true;

    if (invalid) throw new Error('Invalid sender');
  }

  validate() {
    if (this.type === TransactionType.WITHDRAWAL) {
      this.validateWithDrawalFields();
    }
  }
}
