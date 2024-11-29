import { BadRequestException, Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../domain/customer.repository';
import { CreateCustomerDTO } from '../interfaces/dtos/create-customer.dto';
import { CustomerMapper } from '../interfaces/mappers/customer.mapper';

import { IAccountRepository } from '../../account/domain/account.repository';

@Injectable()
export class CustomerService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly customerMapper: CustomerMapper,
  ) {}

  async createCustomer(createCustomerDTO: CreateCustomerDTO) {
    const newCustomer = this.customerMapper.toCreate(createCustomerDTO);

    newCustomer.validate();

    const passwordHash = newCustomer.hashPassword();

    newCustomer.setPassword(passwordHash);

    const alreadyExists = await this.customerRepository.findByDocument(
      newCustomer.document,
    );

    if (alreadyExists) {
      throw new BadRequestException('Document Already Registered');
    }

    const persistedCustomer = await this.customerRepository.create(newCustomer);

    return this.customerMapper.toDTO(persistedCustomer);
  }

  async getCustomerByIdWithRelations(id: number, includeAccounts = true) {
    const customer = await this.customerRepository.findById(id);

    if (!customer) throw new BadRequestException('Customer not Found');

    if (includeAccounts) {
      const accounts = await this.accountRepository.findByOwnerId(customer.id);
      customer.referenceAccounts(accounts);
    }

    return this.customerMapper.toDTO(customer);
  }
}
