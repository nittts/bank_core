import { Decimal } from 'decimal.js';

export class Balance {
  private readonly amount: Decimal;

  constructor(amount: number | Decimal) {
    this.amount = new Decimal(amount);
  }

  add(amount: number): Balance {
    return new Balance(this.amount.plus(amount));
  }

  subtract(amount: number): Balance {
    return new Balance(this.amount.minus(amount));
  }

  getAmount(): number {
    return parseFloat(this.amount.toFixed(2));
  }
}
