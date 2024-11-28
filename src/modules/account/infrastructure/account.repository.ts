import { InjectModel } from '@nestjs/sequelize';
import { AccountModel } from './account.model';
import { Account } from '../domain/account.entity';
import { IAccountRepository } from '../domain/account.repository';
import { CustomerModel } from 'src/modules/customer/infrastructure/customer.model';
import { AccountMapper } from '../interfaces/mappers/account.mapper';
import { TransactionModel } from 'src/modules/transaction/infrastructure/transaction.model';

export class AccountRepository implements IAccountRepository {
  private static START_ACCOUNT_NUMBER = '00000000000';

  constructor(
    @InjectModel(CustomerModel) private customerModel: typeof CustomerModel,
    @InjectModel(AccountModel) private accountModel: typeof AccountModel,
    @InjectModel(TransactionModel)
    private transactionModel: typeof TransactionModel,
    private readonly accountMapper: AccountMapper,
  ) {}

  GLOBAL_INCLUDE = [
    { model: this.customerModel, required: true },
    {
      model: this.transactionModel,
      required: false,
      include: [
        {
          model: this.accountModel,
          foreignKey: 'receiver_id',
          as: 'receiver',
          required: false,
        },
        {
          model: this.accountModel,
          foreignKey: 'sender_id',
          as: 'sender',
          required: false,
        },
      ],
    },
  ];

  async create(account: Account) {
    const payload = this.accountMapper.toPersistence(account);

    const persistedAccount = await this.accountModel.create(payload);

    const customer = await this.customerModel.findByPk(account.owner.id);

    persistedAccount.owner = customer;

    return this.accountMapper.toDomain(persistedAccount);
  }

  async findById(id: number) {
    const persistedAccount = await this.accountModel.findByPk(id, {
      include: this.GLOBAL_INCLUDE,
    });

    if (!persistedAccount) return null;

    return this.accountMapper.toDomain(persistedAccount);
  }

  async findByNumber(number: string) {
    const persistedAccount = await this.accountModel.findOne({
      where: { number },
      include: this.GLOBAL_INCLUDE,
    });

    if (!persistedAccount) return null;

    return this.accountMapper.toDomain(persistedAccount);
  }

  async update(account: Account) {
    const updatedAccount = await this.accountModel.findByPk(account.id, {
      include: this.GLOBAL_INCLUDE,
    });

    const payload = this.accountMapper.toPersistence(account);

    await updatedAccount.update(payload);

    return this.accountMapper.toDomain(updatedAccount);
  }

  async getNewAccountNumber() {
    const latestAccount = await this.accountModel.findOne({
      order: [['number', 'DESC']],
      limit: 1,
    });

    const latestAccountNumber = latestAccount
      ? latestAccount.number
      : AccountRepository.START_ACCOUNT_NUMBER;

    const newAccountNumber = Number(latestAccountNumber) + 1;

    const fmtNewAccountNumber = String(newAccountNumber).padStart(11, '0');

    return fmtNewAccountNumber;
  }
}
