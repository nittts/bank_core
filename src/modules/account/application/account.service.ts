import { Injectable, NotFoundException } from '@nestjs/common';

import { PatchStatusDTO } from '../interfaces/dtos/patch-status.dto';
import { CreateAccountDTO } from '../interfaces/dtos/create-account.dto';

import { AccountMapper } from '../interfaces/mappers/account.mapper';

import { IAccountRepository } from '../domain/account.repository';
import { ITransactionRepository } from '../../transaction/domain/transaction.repository';
import { ICustomerRepository } from '../../customer/domain/customer.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly accountMapper: AccountMapper,
  ) {}

  async findByIdWithRelations(
    id: number,
    includeOwner = true,
    includeTransactions = true,
  ) {
    const account = await this.accountRepository.findById(id);

    if (!account) throw new NotFoundException('Account not Found');

    if (includeOwner) {
      const owner = await this.customerRepository.findById(account.owner_id);
      account.referenceOwner(owner);
    }

    if (includeTransactions) {
      const transactions = await this.transactionRepository.findByAccountId(id);
      account.referenceTransactions(transactions);
    }

    return this.accountMapper.toDTO(account);
  }

  async findById(id: number) {
    const account = await this.accountRepository.findById(id);

    if (!account) throw new NotFoundException('Account not Found');

    return this.accountMapper.toDTO(account);
  }

  async patchAccountStatus(id: number, patchStatusDTO: PatchStatusDTO) {
    const { status } = patchStatusDTO;

    const account = await this.accountRepository.findById(id);

    if (!account) throw new NotFoundException('Account not Found');

    account.updateStatus(status);

    const updatedAccount = await this.accountRepository.update(account);

    return this.accountMapper.toDTO(updatedAccount);
  }

  async createAccount(createAccountDTO: CreateAccountDTO) {
    const { ownerId } = createAccountDTO;

    const owner = await this.customerRepository.findById(ownerId);

    if (!owner) throw new NotFoundException('Owner Customer not found');

    const accountNumber = await this.accountRepository.getNewAccountNumber();

    const newAccount = this.accountMapper.toCreate(
      createAccountDTO,
      accountNumber,
    );

    const persistedAccount = await this.accountRepository.create(newAccount);

    return this.accountMapper.toDTO(persistedAccount);
  }
}
