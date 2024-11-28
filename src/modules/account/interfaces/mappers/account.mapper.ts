import { CustomerMapper } from 'src/modules/customer/interfaces/mappers/customer.mapper';
import { Customer } from 'src/modules/customer/domain/customer.entity';
import { Account } from '../../domain/account.entity';
import { AccountStatus } from '../../domain/enums/account-status.enum';
import { AccountModel } from '../../infrastructure/account.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TransactionMapper } from 'src/modules/transaction/interfaces/mappers/transaction.mapper';

@Injectable()
export class AccountMapper {
  constructor(
    @Inject(forwardRef(() => CustomerMapper))
    private readonly customerMapper: CustomerMapper,
    @Inject(forwardRef(() => TransactionMapper))
    private readonly transactionMapper: TransactionMapper,
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
    const { owner, transactions } = accountModel;

    const mappedOwner = owner ? this.mapAccountOwner(accountModel) : null;
    const mappedTransactions = transactions
      ? this.mapAccountTransactions(accountModel)
      : [];

    return new Account(
      accountModel.id,
      accountModel.number,
      accountModel.status,
      mappedOwner,
      accountModel.createdAt,
      accountModel.updatedAt,
      mappedTransactions,
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

  private mapAccountOwner(accountModel: AccountModel) {
    return this.customerMapper.toDomain(accountModel.owner);
  }
  private mapAccountTransactions(accountModel: AccountModel) {
    return accountModel.transactions.map((model) =>
      this.transactionMapper.toDomain(model),
    );
  }
}
