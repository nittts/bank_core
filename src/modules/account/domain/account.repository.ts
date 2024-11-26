import { Account } from './account.entity';

export abstract class IAccountRepository {
  abstract create(account: Account): Promise<Account>;
  abstract update(account: Account): Promise<Account>;
  abstract find(id: number): Promise<Account | null>;
  abstract getNewAccountNumber(): Promise<string>;
}
