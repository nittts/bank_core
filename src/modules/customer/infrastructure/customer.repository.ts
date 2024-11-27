import { InjectModel } from '@nestjs/sequelize';
import { ICustomerRepository } from '../domain/customer.repository';
import { CustomerModel } from './customer.model';
import { Customer } from '../domain/customer.entity';

import { AccountModel } from 'src/modules/account/infrastructure/account.model';
import { Account } from 'src/modules/account/domain/account.entity';

export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectModel(CustomerModel) private customerModel: typeof CustomerModel,
    @InjectModel(AccountModel) private accountModel: typeof AccountModel,
  ) {}

  async create(customer: Customer) {
    const persistedCustomer = await this.customerModel.create(
      {
        ...customer,
        accounts: [],
      },
      {
        include: [{ model: this.accountModel, required: false }],
      },
    );

    return new Customer(
      persistedCustomer.id,
      persistedCustomer.fullName,
      persistedCustomer.document,
      persistedCustomer.birthDate,
      this.mapCustomerAccounts(persistedCustomer.accounts),
      persistedCustomer.createdAt,
      persistedCustomer.updatedAt,
    );
  }

  async findById(id: number) {
    const persistedCustomer = await this.customerModel.findByPk(id, {
      include: [{ model: this.accountModel, required: false }],
    });

    if (!persistedCustomer) return null;

    return new Customer(
      persistedCustomer.id,
      persistedCustomer.fullName,
      persistedCustomer.document,
      persistedCustomer.birthDate,
      this.mapCustomerAccounts(persistedCustomer.accounts),
      persistedCustomer.createdAt,
      persistedCustomer.updatedAt,
    );
  }

  async findByDocument(document: string) {
    const persistedCustomer = await this.customerModel.findOne({
      where: { document: document },
      include: [{ model: this.accountModel, required: false }],
    });

    if (!persistedCustomer) return null;

    return new Customer(
      persistedCustomer.id,
      persistedCustomer.fullName,
      persistedCustomer.document,
      persistedCustomer.birthDate,
      this.mapCustomerAccounts(persistedCustomer.accounts),
      persistedCustomer.createdAt,
      persistedCustomer.updatedAt,
    );
  }

  private mapCustomerAccounts(accountModels: AccountModel[]) {
    return accountModels.map(
      (model) =>
        new Account(
          model.id,
          model.number,
          model.status,
          null,
          model.createdAt,
          model.updatedAt,
          [],
          model.balance,
        ),
    );
  }
}
