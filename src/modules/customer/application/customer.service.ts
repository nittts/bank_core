import { BadRequestException, Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../domain/customer.repository';
import { CreateCustomerDTO } from '../interfaces/dtos/create-customer.dto';
import { CustomerMapper } from '../interfaces/mappers/customer.mapper';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly customerMapper: CustomerMapper,
  ) {}

  async createCustomer(createCustomerDTO: CreateCustomerDTO) {
    const newCustomer = this.customerMapper.toCreate(createCustomerDTO);

    const validCPF = newCustomer.validateDocument();

    if (!validCPF) {
      throw new BadRequestException('Invalid Document');
    }

    const alreadyExists = await this.customerRepository.findByDocument(
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
