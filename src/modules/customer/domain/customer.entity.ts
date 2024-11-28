import { Account } from 'src/modules/account/domain/account.entity';
import { validateCPF } from 'validations-br';
import * as bcrypt from 'bcrypt';

export class Customer {
  public id: number | null;
  public fullName: string;
  public document: string;
  public birthDate: Date;
  public password: string;

  public accounts: Account[] | null;

  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    fullName: string,
    document: string,
    birthDate: Date,
    password: string,
    createdAt: Date | null,
    updatedAt: Date | null,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.document = document;
    this.birthDate = new Date(birthDate);
    this.accounts = null;
    this.password = password;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);

    this.validate();
  }

  validateDocument() {
    const valid = validateCPF(this.document);
    if (!valid) throw new Error('Invalid Document');
  }

  validate() {
    this.validateDocument();
  }

  hashPassword() {
    return bcrypt.hashSync(this.password, 10);
  }

  setPassword(newPassword: string) {
    this.password = newPassword;
  }

  referenceAccounts(accounts: Account[]) {
    this.accounts = accounts;
  }
}
