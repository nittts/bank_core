import { Account } from './account.entity';

export abstract class IAccountRepository {
  abstract create(account: Account): Promise<Account>;
  abstract update(account: Account): Promise<Account>;
  abstract findById(id: number): Promise<Account | null>;
  abstract findByNumber(number: string): Promise<Account | null>;
  abstract findByOwnerId(ownerId: number): Promise<Account[]>;
  abstract getNewAccountNumber(): Promise<string>;
}
