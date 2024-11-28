import { Customer } from '../../domain/customer.entity';
import { CustomerModel } from '../../infrastructure/customer.model';
import { CreateCustomerDTO } from '../dtos/create-customer.dto';
import { Injectable } from '@nestjs/common';
import { CustomerResponseDTO } from '../dtos/customer-response.dto';

@Injectable()
export class CustomerMapper {
  toCreate(createCustomerDTO: CreateCustomerDTO): Customer {
    return new Customer(
      null,
      createCustomerDTO.fullName,
      createCustomerDTO.document,
      createCustomerDTO.birthDate,
      createCustomerDTO.password,
      new Date(),
      new Date(),
    );
  }

  toPersistence(customer: Customer) {
    return {
      fullName: customer.fullName,
      document: customer.document,
      birthDate: customer.birthDate,
      password: customer.password,
    };
  }

  toDomain(customerModel: CustomerModel): Customer {
    return new Customer(
      customerModel.id,
      customerModel.fullName,
      customerModel.document,
      customerModel.birthDate,
      customerModel.password,
      customerModel.createdAt,
      customerModel.updatedAt,
    );
  }

  toDTO(customer: Customer) {
    return new CustomerResponseDTO(customer);
  }
}
