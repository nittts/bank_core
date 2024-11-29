import { Customer } from '../../customer/domain/customer.entity';
import { AccountStatus } from './enums/account-status.enum';
import { Balance } from './value-objects/balance.value-object';
import { Transaction } from '../../transaction/domain/transaction.entity';

export class Account {
  public id: number | null;
  public number: string;
  public status: AccountStatus;
  private balance: Balance;

  public owner_id: number;
  public owner: Customer | null;

  public transactions: Transaction[] | null;

  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    number: string,
    status: AccountStatus,
    owner_id: number,
    createdAt: Date | null,
    updatedAt: Date | null,
    balance: number,
  ) {
    this.id = id;
    this.number = number;
    this.owner_id = owner_id;
    this.status = status;
    this.balance = new Balance(balance);
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    this.owner = null;
    this.transactions = null;
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

  referenceOwner(owner: Customer) {
    this.owner = owner;
  }

  referenceTransactions(transactions: Transaction[]) {
    this.transactions = transactions;
  }
}
