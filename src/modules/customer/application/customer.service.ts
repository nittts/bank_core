import { BadRequestException, Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../domain/customer.repository';
import { CreateCustomerDTO } from '../shared/dto/create-customer.dto';
import { Customer } from '../domain/customer.entity';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async createCustomer(createCustomerDTO: CreateCustomerDTO) {
    const newCustomer = new Customer(
      null,
      createCustomerDTO.fullName,
      createCustomerDTO.document,
      createCustomerDTO.birthDate,
      [],
      null,
      null,
    );

    const validCPF = newCustomer.validateDocument();

    if (!validCPF) {
      throw new BadRequestException('Invalid Document');
    }

    const alreadyExists = this.customerRepository.findByDocument(
      newCustomer.document,
    );

    if (alreadyExists) {
      throw new BadRequestException('Document Already Registered');
    }

    return this.customerRepository.create(newCustomer);
  }

  async getCustomer(id: number) {
    const customer = await this.customerRepository.findById(id);

    if (!customer) throw new BadRequestException('Customer not Found');

    return customer;
  }
}
