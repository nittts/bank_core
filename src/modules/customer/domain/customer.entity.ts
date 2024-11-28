import { Account } from 'src/modules/account/domain/account.entity';
import { validateCPF } from 'validations-br';
import * as bcrypt from 'bcrypt';

export class Customer {
  public id: number | null;
  public fullName: string;
  public document: string;
  public birthDate: Date;
  public password: string;

  public accounts: Account[];

  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    fullName: string,
    document: string,
    birthDate: Date,
    accounts: Account[],
    password: string,
    createdAt: Date | null,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.document = document;
    this.birthDate = new Date(birthDate);
    this.accounts = accounts;
    this.password = password;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }

  validateDocument() {
    return validateCPF(this.document);
  }

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
