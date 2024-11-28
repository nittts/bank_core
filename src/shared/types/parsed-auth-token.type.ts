import { Transaction } from 'src/modules/transaction/domain/transaction.entity';

export type ParsedAuthToken = {
  sub: number;
  accounts: Transaction[];
  fullName: string;
  birthDate: string;
};
