import { Account } from '../../domain/account.entity';
import { AccountStatus } from '../../domain/enums/account-status.enum';
import { AccountModel } from '../../infrastructure/account.model';
import { CreateAccountDTO } from '../dtos/create-account.dto';
import { AccountResponseDTO } from '../dtos/account-response.dto';

export class AccountMapper {
  toCreate(createAccountDTO: CreateAccountDTO, accountNumber: string): Account {
    return new Account(
      null,
      accountNumber,
      AccountStatus.INACTIVE,
      createAccountDTO.ownerId,
      new Date(),
      new Date(),
      0,
    );
  }

  toDomain(accountModel: AccountModel): Account {
    return new Account(
      accountModel.id,
      accountModel.number,
      accountModel.status,
      accountModel.owner_id,
      accountModel.createdAt,
      accountModel.updatedAt,
      accountModel.balance,
    );
  }

  toPersistence(account: Account) {
    return {
      number: account.number,
      status: account.status,
      owner_id: account.owner_id,
      balance: account.getBalance(),
    };
  }

  toDTO(account: Account) {
    return new AccountResponseDTO(account);
  }
}
