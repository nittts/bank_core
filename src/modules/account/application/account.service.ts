import { BadRequestException, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../domain/account.repository';

import { PatchStatusDTO } from '../interfaces/dtos/patch-status.dto';
import { CreateAccountDTO } from '../interfaces/dtos/create-account.dto';

import { CustomerService } from 'src/modules/customer/application/customer.service';
import { AccountMapper } from '../interfaces/mappers/account.mapper';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly customerService: CustomerService,
    private readonly accountMapper: AccountMapper,
  ) {}

  async getAccount(id: number) {
    const account = await this.accountRepository.find(id);

    if (!account) throw new BadRequestException('Account not Found');

    return account;
  }

  async patchAccountStatus(id: number, patchStatusDTO: PatchStatusDTO) {
    const { status } = patchStatusDTO;

    const account = await this.accountRepository.find(id);

    if (!account) throw new BadRequestException('Account not Found');

    account.updateStatus(status);

    return await this.accountRepository.update(account);
  }

  async createAccount(createAccountDTO: CreateAccountDTO) {
    const { ownerId } = createAccountDTO;

    const owner = await this.customerService.getCustomer(ownerId);

    const accountNumber = await this.accountRepository.getNewAccountNumber();

    const newAccount = this.accountMapper.toCreate(owner, accountNumber);

    return this.accountRepository.create(newAccount);
  }
}
