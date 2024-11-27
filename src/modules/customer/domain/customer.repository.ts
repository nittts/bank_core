import { Customer } from './customer.entity';

export abstract class ICustomerRepository {
  abstract create(customer: Customer): Promise<Customer>;
  abstract findById(id: number): Promise<Customer | null>;
  abstract findByDocument(document: string): Promise<Customer | null>;
}
