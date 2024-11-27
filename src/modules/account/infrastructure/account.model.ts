import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AccountStatus } from '../shared/enums/account-status.enum';
import { CustomerModel } from 'src/modules/customer/infrastructure/customer.model';

@Table({ tableName: 'account' })
export class AccountModel extends Model<AccountModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING({ length: 20 }),
    allowNull: false,
    unique: true,
  })
  number: string;

  @Column({
    type: DataType.ENUM(...Object.values(AccountStatus)),
    allowNull: false,
    defaultValue: AccountStatus.INACTIVE,
  })
  status: AccountStatus;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  balance: number;

  @ForeignKey(() => CustomerModel)
  owner_id: number;

  @BelongsTo(() => CustomerModel)
  owner: CustomerModel;
}
