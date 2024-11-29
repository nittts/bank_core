import { Account } from '../../account/domain/account.entity';
import { Transaction } from './transaction.entity';

export abstract class ITransactionRepository {
  abstract performWithdrawal(
    transaction: Transaction,
    decrementBalance: (account: Account) => void,
  ): Promise<Transaction>;

  abstract performDeposit(
    transaction: Transaction,
    incrementBalance: (account: Account) => void,
  ): Promise<Transaction>;

  abstract performTransaction(
    transaction: Transaction,
    updateBalances: (sender: Account, receiver: Account) => void,
  ): Promise<Transaction>;

  abstract findById(id: number): Promise<Transaction>;

  abstract findByAccountId(id: number): Promise<Transaction[]>;
}
