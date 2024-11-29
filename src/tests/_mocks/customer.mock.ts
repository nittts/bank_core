import { ICustomerRepository } from '../../modules/customer/domain/customer.repository';
import { Customer } from '../../modules/customer/domain/customer.entity';

let id = 0;

export function getCustomerMock(override?: Partial<Customer>) {
  return new Customer(
    override?.id ?? id++,
    override?.fullName ?? `Customer ${id}`,
    override?.document ?? '53989480081',
    override?.birthDate ?? new Date(),
    override?.password ?? '1234',
    override?.createdAt ?? new Date(),
    override?.updatedAt ?? new Date(),
  );
}

export const CustomerRepositoryMock: ICustomerRepository = {
  findByDocument: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};
