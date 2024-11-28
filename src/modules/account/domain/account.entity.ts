import { Customer } from 'src/modules/customer/domain/customer.entity';
import { AccountStatus } from './enums/account-status.enum';
import { Balance } from './value-objects/balance.value-object';
import { Transaction } from 'src/modules/transaction/domain/transaction.entity';

export class Account {
  public id: number | null;
  public number: string;
  public status: AccountStatus;
  private balance: Balance;

  public owner: Customer | null;
  public transactions: Transaction[];

  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    number: string,
    status: AccountStatus,
    owner: Customer,
    createdAt: Date | null,
    updatedAt: Date | null,
    transactions: Transaction[] | null,
    balance: number,
  ) {
    this.id = id;
    this.number = number;
    this.owner = owner;
    this.status = status;
    this.transactions = transactions ?? [];
    this.balance = new Balance(balance);
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }

  incrementBalance(amount: number) {
    this.balance = this.balance.add(amount);
  }

  decrementBalance(amount: number) {
    this.balance = this.balance.subtract(amount);
  }

  getBalance() {
    return this.balance.getAmount();
  }

  isActive() {
    return this.status === AccountStatus.ACTIVE;
  }

  updateStatus(status: AccountStatus) {
    this.status = status;
  }

  hasEnoughFunds(amount: number) {
    return this.balance.subtract(amount).getBalance().greaterThanOrEqualTo(0);
  }
}
