import { BadRequestException, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../domain/account.repository';
import { Account } from '../domain/account.entity';

import { PatchStatusDTO } from '../shared/dto/patch-status.dto';
import { CreateAccountDTO } from '../shared/dto/create-account.dto';
import { AccountStatus } from '../shared/enums/account-status.enum';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

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
    console.log(createAccountDTO);

    const owner = null; // Mock implementation until customer entity is created and related

    const accountNumber = await this.accountRepository.getNewAccountNumber();

    const newAccount = new Account(
      null,
      accountNumber,
      AccountStatus.INACTIVE,
      owner,
      null,
      null,
      [],
      0,
    );

    return this.accountRepository.create(newAccount);
  }
}
