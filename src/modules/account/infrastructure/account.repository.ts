import { InjectModel } from '@nestjs/sequelize';
import { AccountModel } from './account.model';
import { Account } from '../domain/account.entity';
import { IAccountRepository } from '../domain/account.repository';

export class AccountRepository implements IAccountRepository {
  private static START_ACCOUNT_NUMBER = '00000000000';

  constructor(
    @InjectModel(AccountModel) private accountModel: typeof AccountModel,
  ) {}

  async create(account: Account) {
    const persistedAccount = await this.accountModel.create({
      ...account,
      owner_id: 1,
      balance: account.getBalance(),
    });

    return new Account(
      persistedAccount.id,
      persistedAccount.number,
      persistedAccount.status,
      null,
      persistedAccount.createdAt,
      persistedAccount.updatedAt,
      [],
      persistedAccount.balance,
    );
  }

  async find(id: number) {
    const persistedAccount = await this.accountModel.findByPk(id);

    if (!persistedAccount) return null;

    return new Account(
      persistedAccount.id,
      persistedAccount.number,
      persistedAccount.status,
      null,
      persistedAccount.createdAt,
      persistedAccount.updatedAt,
      [],
      persistedAccount.balance,
    );
  }

  async update(account: Account) {
    const updatedAccount = await this.accountModel.findByPk(account.id);

    await updatedAccount.update({ ...account, balance: account.getBalance() });

    return new Account(
      updatedAccount.id,
      updatedAccount.number,
      updatedAccount.status,
      null,
      updatedAccount.createdAt,
      updatedAccount.updatedAt,
      [],
      updatedAccount.balance,
    );
  }

  async getNewAccountNumber() {
    const latestAccount = await this.accountModel.findOne({
      order: [['number', 'DESC']],
      limit: 1,
    });

    const latestAccountNumber = latestAccount
      ? latestAccount.number
      : AccountRepository.START_ACCOUNT_NUMBER;

    const newAccountNumber = Number(latestAccountNumber) + 1;

    const fmtNewAccountNumber = String(newAccountNumber).padStart(11, '0');

    return fmtNewAccountNumber;
  }
}
