import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ICustomerRepository } from '../../modules/customer/domain/customer.repository';
import { ITransactionRepository } from '../../modules/transaction/domain/transaction.repository';

import { IAccountRepository } from '../../modules/account/domain/account.repository';
import { AccountService } from '../../modules/account/application/account.service';
import { AccountMapper } from '../../modules/account/interfaces/mappers/account.mapper';
import { AccountStatus } from '../../modules/account/domain/enums/account-status.enum';

import { AccountRepositoryMock, getAccountMock } from '../_mocks/account.mock';
import {
  CustomerRepositoryMock,
  getCustomerMock,
} from '../_mocks/customer.mock';
import {
  getTransactionMock,
  TransactionRepositoryMock,
} from '../_mocks/transaction.mock';

import { AccountResponseDTO } from '../../modules/account/interfaces/dtos/account-response.dto';
import { PatchStatusDTO } from '../../modules/account/interfaces/dtos/patch-status.dto';
import { CreateAccountDTO } from '../../modules/account/interfaces/dtos/create-account.dto';

describe(AccountService.name, () => {
  let accountService: jest.Mocked<AccountService>;
  let accountRepository: jest.Mocked<IAccountRepository>;
  let customerRepository: jest.Mocked<ICustomerRepository>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: IAccountRepository, useValue: AccountRepositoryMock },
        {
          provide: ITransactionRepository,
          useValue: TransactionRepositoryMock,
        },
        { provide: ICustomerRepository, useValue: CustomerRepositoryMock },
        AccountMapper,
      ],
    }).compile();

    accountService = moduleRef.get(AccountService);
    accountRepository = moduleRef.get(IAccountRepository);
    customerRepository = moduleRef.get(ICustomerRepository);
    transactionRepository = moduleRef.get(ITransactionRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should  be defined', () => {
    expect(accountService).toBeDefined();
  });

  describe(AccountService.prototype.findByIdWithRelations.name, () => {
    it('Should be able to find an account with relations', async () => {
      const accountMock = getAccountMock();
      const customerMock = getCustomerMock();
      const transactionMock = getTransactionMock();

      accountRepository.findById.mockResolvedValue(accountMock);
      customerRepository.findById.mockResolvedValue(customerMock);
      transactionRepository.findByAccountId.mockResolvedValue([
        transactionMock,
      ]);

      accountMock.referenceOwner(customerMock);
      accountMock.referenceTransactions([transactionMock]);

      const response = await accountService.findByIdWithRelations(
        accountMock.id,
        true,
        true,
      );

      expect(response).toEqual(new AccountResponseDTO(accountMock));
    });

    it('Should fail if cannot find account', async () => {
      const accountMock = getAccountMock();

      accountRepository.findById.mockResolvedValue(null);

      const toRun = async () =>
        await accountService.findByIdWithRelations(accountMock.id);

      expect(toRun).rejects.toThrow(new NotFoundException('Account not Found'));
    });
  });

  describe(AccountService.prototype.findById.name, () => {
    it('Should be able to find an account without relations', async () => {
      const accountMock = getAccountMock();

      accountRepository.findById.mockResolvedValue(accountMock);

      const response = await accountService.findById(accountMock.id);

      expect(response).toEqual(new AccountResponseDTO(accountMock));
    });

    it('Should fail if cannot find account', async () => {
      const accountMock = getAccountMock();

      accountRepository.findById.mockResolvedValue(null);

      const toRun = async () => await accountService.findById(accountMock.id);

      expect(toRun).rejects.toThrow(new NotFoundException('Account not Found'));
    });
  });

  describe(AccountService.prototype.patchAccountStatus.name, () => {
    it('Should be able to patch an account status', async () => {
      const accountMock = getAccountMock();

      accountRepository.findById.mockResolvedValue(accountMock);

      accountMock.updateStatus(AccountStatus.INACTIVE);

      accountRepository.update.mockResolvedValue(accountMock);

      const command: PatchStatusDTO = { status: AccountStatus.INACTIVE };

      const response = await accountService.patchAccountStatus(
        accountMock.id,
        command,
      );

      expect(response).toEqual(new AccountResponseDTO(accountMock));
    });

    it('Should fail if cannot find account', async () => {
      const accountMock = getAccountMock();

      accountRepository.findById.mockResolvedValue(null);

      const command: PatchStatusDTO = { status: AccountStatus.INACTIVE };

      const toRun = async () =>
        await accountService.patchAccountStatus(accountMock.id, command);

      expect(toRun).rejects.toThrow(new NotFoundException('Account not Found'));
    });
  });

  describe(AccountService.prototype.createAccount.name, () => {
    it('Should be able to create an account', async () => {
      const accountMock = getAccountMock();
      const customerMock = getCustomerMock();

      customerRepository.findById.mockResolvedValue(customerMock);
      accountRepository.getNewAccountNumber.mockResolvedValue(
        accountMock.number,
      );

      accountRepository.create.mockResolvedValue(accountMock);

      const command: CreateAccountDTO = {
        ownerId: customerMock.id,
      };

      const response = await accountService.createAccount(command);

      expect(response).toEqual(new AccountResponseDTO(accountMock));
    });

    it('Should fail if cannot find owner', async () => {
      const accountMock = getAccountMock();
      const customerMock = getCustomerMock();

      accountRepository.getNewAccountNumber.mockResolvedValue(
        accountMock.number,
      );
      customerRepository.findById.mockResolvedValue(null);

      accountRepository.create.mockResolvedValue(accountMock);

      const command: CreateAccountDTO = {
        ownerId: customerMock.id,
      };

      const toRun = async () => await accountService.createAccount(command);

      expect(toRun).rejects.toThrow(
        new NotFoundException('Owner Customer not found'),
      );
    });
  });
});
