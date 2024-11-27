import { InjectModel } from '@nestjs/sequelize';
import { AccountModel } from './account.model';
import { Account } from '../domain/account.entity';
import { IAccountRepository } from '../domain/account.repository';
import { CustomerModel } from 'src/modules/customer/infrastructure/customer.model';
import { Customer } from 'src/modules/customer/domain/customer.entity';

export class AccountRepository implements IAccountRepository {
  private static START_ACCOUNT_NUMBER = '00000000000';

  constructor(
    @InjectModel(CustomerModel) private customerModel: typeof CustomerModel,
    @InjectModel(AccountModel) private accountModel: typeof AccountModel,
  ) {}

  async create(account: Account) {
    const payload = {
      number: account.number,
      status: account.status,
      owner_id: account.owner.id,
      balance: account.getBalance(),
    };

    const persistedAccount = await this.accountModel.create(payload);

    const customer = await this.customerModel.findByPk(account.owner.id);

    return new Account(
      persistedAccount.id,
      persistedAccount.number,
      persistedAccount.status,
      this.mapCustomerModel(customer),
      persistedAccount.createdAt,
      persistedAccount.updatedAt,
      [],
      persistedAccount.balance,
    );
  }

  async find(id: number) {
    const persistedAccount = await this.accountModel.findByPk(id, {
      include: [{ model: this.customerModel, required: true }],
    });

    if (!persistedAccount) return null;

    return new Account(
      persistedAccount.id,
      persistedAccount.number,
      persistedAccount.status,
      this.mapCustomerModel(persistedAccount.owner),
      persistedAccount.createdAt,
      persistedAccount.updatedAt,
      [],
      persistedAccount.balance,
    );
  }

  async update(account: Account) {
    const updatedAccount = await this.accountModel.findByPk(account.id, {
      include: [{ model: this.customerModel, required: true }],
    });

    await updatedAccount.update({ ...account, balance: account.getBalance() });

    return new Account(
      updatedAccount.id,
      updatedAccount.number,
      updatedAccount.status,
      this.mapCustomerModel(updatedAccount.owner),
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

  private mapCustomerModel(customerModel: CustomerModel) {
    return new Customer(
      customerModel.id,
      customerModel.fullName,
      customerModel.document,
      customerModel.birthDate,
      [],
      customerModel.createdAt,
      customerModel.updatedAt,
    );
  }
}
