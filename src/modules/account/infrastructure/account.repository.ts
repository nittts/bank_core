import { InjectModel } from '@nestjs/sequelize';
import { AccountModel } from './account.model';
import { Account } from '../domain/account.entity';
import { IAccountRepository } from '../domain/account.repository';
import { AccountMapper } from '../interfaces/mappers/account.mapper';

export class AccountRepository implements IAccountRepository {
  private static START_ACCOUNT_NUMBER = '00000000000';

  constructor(
    @InjectModel(AccountModel) private accountModel: typeof AccountModel,
    private readonly accountMapper: AccountMapper,
  ) {}

  async create(account: Account) {
    const payload = this.accountMapper.toPersistence(account);

    const persistedAccount = await this.accountModel.create(payload);

    return this.accountMapper.toDomain(persistedAccount);
  }

  async findById(id: number) {
    const persistedAccount = await this.accountModel.findByPk(id);

    if (!persistedAccount) return null;

    return this.accountMapper.toDomain(persistedAccount);
  }

  async findByNumber(number: string) {
    const persistedAccount = await this.accountModel.findOne({
      where: { number },
    });

    if (!persistedAccount) return null;

    return this.accountMapper.toDomain(persistedAccount);
  }

  async update(account: Account) {
    const updatedAccount = await this.accountModel.findByPk(account.id);

    const payload = this.accountMapper.toPersistence(account);

    await updatedAccount.update(payload);

    return this.accountMapper.toDomain(updatedAccount);
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

  async findByOwnerId(ownerId: number) {
    const accounts = await this.accountModel.findAll({
      where: { owner_id: ownerId },
    });

    return accounts.map((account) => this.accountMapper.toDomain(account));
  }
}
