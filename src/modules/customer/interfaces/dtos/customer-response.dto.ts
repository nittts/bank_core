import { AccountResponseDTO } from 'src/modules/account/interfaces/dtos/account-response.dto';
import { Customer } from '../../domain/customer.entity';

export class CustomerResponseDTO {
  public id: number;
  public birthDate: Date;
  public document: string;
  public fullName: string;
  public createdAt: Date;
  public updatedAt: Date;

  public accounts: AccountResponseDTO[] | null;

  constructor(customer: Customer) {
    const { accounts } = customer;

    const mappedAccounts = accounts
      ? accounts.map((account) => new AccountResponseDTO(account))
      : null;

    this.accounts = mappedAccounts;
    this.birthDate = customer.birthDate;
    this.createdAt = customer.createdAt;
    this.document = customer.document;
    this.fullName = customer.fullName;
    this.id = customer.id;
    this.updatedAt = customer.updatedAt;
  }
}
