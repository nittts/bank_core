import { CustomerResponseDTO } from 'src/modules/customer/interfaces/dtos/customer-response.dto';
import { Account } from '../../domain/account.entity';
import { AccountStatus } from '../../domain/enums/account-status.enum';
import { TransactionResponseDTO } from 'src/modules/transaction/interfaces/dtos/transaction-response.dto';

export class AccountResponseDTO {
  public id: number;
  public number: string;
  public status: AccountStatus;
  public balance: number;
  public createdAt: Date;
  public updatedAt: Date;
  public owner_id: number;

  public owner: CustomerResponseDTO | null;
  public transactions: TransactionResponseDTO[] | null;

  constructor(account: Account) {
    const { owner, transactions } = account;

    const accTransactions = transactions
      ? account.transactions.map(
          (transaction) => new TransactionResponseDTO(transaction),
        )
      : null;

    const accOwner = owner ? new CustomerResponseDTO(owner) : null;

    this.id = account.id;
    this.number = account.number;
    this.status = account.status;
    this.createdAt = account.createdAt;
    this.updatedAt = account.updatedAt;
    this.balance = account.getBalance();
    this.owner_id = account.owner_id;
    this.owner = accOwner;
    this.transactions = accTransactions;
  }
}
