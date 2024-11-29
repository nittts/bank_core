import { ITransactionRepository } from '../../modules/transaction/domain/transaction.repository';
import { TransactionType } from '../../modules/transaction/domain/enums/transaction-type.enum';
import { Transaction } from '../../modules/transaction/domain/transaction.entity';
import { getAccountMock } from './account.mock';

let id = 0;

export function getTransactionMock(override?: Partial<Transaction>) {
  return new Transaction(
    override?.id ?? id++,
    override?.type ?? TransactionType.DEPOSIT,
    override?.amount ?? 10,
    override?.sender_id ?? getAccountMock().id,
    override?.receiver_id ?? getAccountMock().id,
    override?.createdAt ?? new Date(),
    override?.updatedAt ?? new Date(),
  );
}

export const TransactionRepositoryMock: ITransactionRepository = {
  findByAccountId: jest.fn(),
  findById: jest.fn(),
  performDeposit: jest.fn(),
  performTransaction: jest.fn(),
  performWithdrawal: jest.fn(),
};
