import { CustomerMapper } from 'src/modules/customer/interfaces/mappers/customer.mapper';
import { Customer } from 'src/modules/customer/domain/customer.entity';
import { Account } from '../../domain/account.entity';
import { AccountStatus } from '../../domain/enums/account-status.enum';
import { AccountModel } from '../../infrastructure/account.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AccountMapper {
  constructor(
    @Inject(forwardRef(() => CustomerMapper))
    private readonly customerMapper: CustomerMapper,
  ) {}

  toCreate(owner: Customer, accountNumber: string): Account {
    return new Account(
      null,
      accountNumber,
      AccountStatus.INACTIVE,
      owner,
      new Date(),
      new Date(),
      [],
      0,
    );
  }

  toDomain(accountModel: AccountModel): Account {
    const mappedOwner = this.mapAccountOwner(accountModel);

    return new Account(
      accountModel.id,
      accountModel.number,
      accountModel.status,
      mappedOwner,
      accountModel.createdAt,
      accountModel.updatedAt,
      [],
      accountModel.balance,
    );
  }

  toPersistence(account: Account) {
    return {
      number: account.number,
      status: account.status,
      owner_id: account.owner.id,
      balance: account.getBalance(),
    };
  }

  private mapAccountOwner(accountModel: AccountModel): Customer {
    return this.customerMapper.toDomain(accountModel.owner);
  }
}
