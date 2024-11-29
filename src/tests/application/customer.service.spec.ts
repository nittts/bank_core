import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import {
  CustomerRepositoryMock,
  getCustomerMock,
} from '../_mocks/customer.mock';
import { AccountRepositoryMock, getAccountMock } from '../_mocks/account.mock';

import { ICustomerRepository } from '../../modules/customer/domain/customer.repository';
import { CustomerService } from '../../modules/customer/application/customer.service';
import { CustomerMapper } from '../../modules/customer/interfaces/mappers/customer.mapper';

import { CreateCustomerDTO } from '../../modules/customer/interfaces/dtos/create-customer.dto';
import { CustomerResponseDTO } from '../../modules/customer/interfaces/dtos/customer-response.dto';
import { IAccountRepository } from '../../modules/account/domain/account.repository';

describe(CustomerService.name, () => {
  let customerService: jest.Mocked<CustomerService>;
  let customerRepository: jest.Mocked<ICustomerRepository>;
  let accountRepository: jest.Mocked<IAccountRepository>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: IAccountRepository, useValue: AccountRepositoryMock },
        { provide: ICustomerRepository, useValue: CustomerRepositoryMock },
        CustomerMapper,
      ],
    }).compile();

    customerService = moduleRef.get(CustomerService);
    customerRepository = moduleRef.get(ICustomerRepository);
    accountRepository = moduleRef.get(IAccountRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should  be defined', () => {
    expect(customerService).toBeDefined();
  });

  describe(CustomerService.prototype.createCustomer.name, () => {
    it('Should be able to create a new customer', async () => {
      const customer = getCustomerMock();

      const command: CreateCustomerDTO = {
        birthDate: customer.birthDate,
        document: customer.document,
        fullName: customer.fullName,
        password: customer.password,
      };

      customerRepository.findByDocument.mockResolvedValue(null);

      customer.setPassword(customer.hashPassword());

      customerRepository.create.mockResolvedValue(customer);

      const response = await customerService.createCustomer(command);

      expect(response).toEqual(new CustomerResponseDTO(customer));
    });

    it('Should fail if user already exists', async () => {
      const customer = getCustomerMock();

      const command: CreateCustomerDTO = {
        birthDate: customer.birthDate,
        document: customer.document,
        fullName: customer.fullName,
        password: customer.password,
      };

      customerRepository.findByDocument.mockResolvedValue(customer);

      const toRun = async () => await customerService.createCustomer(command);

      expect(toRun).rejects.toThrow(
        new BadRequestException('Document Already Registered'),
      );
    });

    it('Should fail if user has invalid document', async () => {
      const customer = getCustomerMock({ document: '0000000000' });

      const command: CreateCustomerDTO = {
        birthDate: customer.birthDate,
        document: customer.document,
        fullName: customer.fullName,
        password: customer.password,
      };

      customerRepository.findByDocument.mockResolvedValue(null);

      const toRun = async () => await customerService.createCustomer(command);

      expect(toRun).rejects.toThrow(new Error('Invalid Document'));
    });
  });

  describe(CustomerService.prototype.getCustomerByIdWithRelations.name, () => {
    it('Should return customer with their relations', async () => {
      const customer = getCustomerMock();
      const accounts = [getAccountMock(), getAccountMock()];

      customerRepository.findById.mockResolvedValue(customer);
      accountRepository.findByOwnerId.mockResolvedValue(accounts);

      customer.referenceAccounts(accounts);

      const response = await customerService.getCustomerByIdWithRelations(
        customer.id,
        true,
      );

      expect(response).toEqual(new CustomerResponseDTO(customer));
    });

    it('Should fail if customer cannot be found', async () => {
      const customer = getCustomerMock();

      customerRepository.findById.mockResolvedValue(null);

      const toRun = async () =>
        await customerService.getCustomerByIdWithRelations(customer.id, true);

      expect(toRun).rejects.toThrow(
        new BadRequestException('Customer not Found'),
      );
    });
  });
});
