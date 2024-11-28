import { AccountMapper } from 'src/modules/account/interfaces/mappers/account.mapper';
import { Customer } from '../../domain/customer.entity';
import { CustomerModel } from '../../infrastructure/customer.model';
import { CreateCustomerDTO } from '../dtos/create-customer.dto';
import { Injectable } from '@nestjs/common';
import { Account } from 'src/modules/account/domain/account.entity';

@Injectable()
export class CustomerMapper {
  constructor(private readonly accountMapper: AccountMapper) {}

  toCreate(createCustomerDTO: CreateCustomerDTO): Customer {
    return new Customer(
      null,
      createCustomerDTO.fullName,
      createCustomerDTO.document,
      createCustomerDTO.birthDate,
      [],
      new Date(),
      new Date(),
    );
  }

  toPersistence(customer: Customer) {
    return {
      fullName: customer.fullName,
      document: customer.document,
      birthDate: customer.birthDate,
    };
  }

  toDomain(customerModel: CustomerModel): Customer {
    const { accounts } = customerModel;
    const mappedAccounts = accounts
      ? this.mapCustomerAccounts(customerModel)
      : [];

    return new Customer(
      customerModel.id,
      customerModel.fullName,
      customerModel.document,
      customerModel.birthDate,
      mappedAccounts,
      customerModel.createdAt,
      customerModel.updatedAt,
    );
  }

  private mapCustomerAccounts(customerModel: CustomerModel): Account[] {
    return customerModel.accounts.map((model) =>
      this.accountMapper.toDomain(model),
    );
  }
}
