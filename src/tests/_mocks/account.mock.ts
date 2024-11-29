import { AccountStatus } from '../../modules/account/domain/enums/account-status.enum';
import { Account } from '../../modules/account/domain/account.entity';
import { getCustomerMock } from './customer.mock';
import { IAccountRepository } from '../../modules/account/domain/account.repository';

let id = 0;

export function getAccountMock(override?: Partial<Account>) {
  return new Account(
    override?.id ?? id++,
    override?.number ?? `000000000${id}`,
    override?.status ?? AccountStatus.ACTIVE,
    override?.owner_id ?? getCustomerMock().id,
    override?.createdAt ?? new Date(),
    override?.updatedAt ?? new Date(),
    override?.getBalance ? override.getBalance() : 0,
  );
}

export const AccountRepositoryMock: IAccountRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findByNumber: jest.fn(),
  findByOwnerId: jest.fn(),
  getNewAccountNumber: jest.fn(),
};
