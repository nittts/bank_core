import { InjectModel } from '@nestjs/sequelize';
import { ICustomerRepository } from '../domain/customer.repository';
import { CustomerModel } from './customer.model';
import { Customer } from '../domain/customer.entity';

import { CustomerMapper } from '../interfaces/mappers/customer.mapper';

export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectModel(CustomerModel) private customerModel: typeof CustomerModel,
    private readonly customerMapper: CustomerMapper,
  ) {}

  async create(customer: Customer) {
    const payload = this.customerMapper.toPersistence(customer);

    const persistedCustomer = await this.customerModel.create(payload);

    persistedCustomer.accounts = [];

    return this.customerMapper.toDomain(persistedCustomer);
  }

  async findById(id: number) {
    const persistedCustomer = await this.customerModel.findByPk(id, {});

    if (!persistedCustomer) return null;

    return this.customerMapper.toDomain(persistedCustomer);
  }

  async findByDocument(document: string) {
    const persistedCustomer = await this.customerModel.findOne({
      where: { document: document },
    });

    if (!persistedCustomer) return null;

    return this.customerMapper.toDomain(persistedCustomer);
  }
}
