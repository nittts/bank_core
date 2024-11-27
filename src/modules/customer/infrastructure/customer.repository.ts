import { InjectModel } from '@nestjs/sequelize';
import { ICustomerRepository } from '../domain/customer.repository';
import { CustomerModel } from './customer.model';
import { Customer } from '../domain/customer.entity';

import { AccountModel } from 'src/modules/account/infrastructure/account.model';
import { CustomerMapper } from '../interfaces/mappers/customer.mapper';

export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectModel(CustomerModel) private customerModel: typeof CustomerModel,
    @InjectModel(AccountModel) private accountModel: typeof AccountModel,
    private readonly customerMapper: CustomerMapper,
  ) {}

  GLOBAL_INCLUDE = [
    {
      model: this.accountModel,
      required: false,
      include: [{ model: this.customerModel, required: true }],
    },
  ];

  async create(customer: Customer) {
    const payload = this.customerMapper.toPersistence(customer);

    const persistedCustomer = await this.customerModel.create(payload);

    persistedCustomer.accounts = [];

    return this.customerMapper.toDomain(persistedCustomer);
  }

  async findById(id: number) {
    const persistedCustomer = await this.customerModel.findByPk(id, {
      include: this.GLOBAL_INCLUDE,
    });

    if (!persistedCustomer) return null;

    return this.customerMapper.toDomain(persistedCustomer);
  }

  async findByDocument(document: string) {
    const persistedCustomer = await this.customerModel.findOne({
      where: { document: document },
      include: this.GLOBAL_INCLUDE,
    });

    if (!persistedCustomer) return null;

    return this.customerMapper.toDomain(persistedCustomer);
  }
}
