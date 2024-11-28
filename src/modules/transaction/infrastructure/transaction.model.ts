import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { TransactionType } from '../domain/enums/transaction-type.enum';
import { AccountModel } from 'src/modules/account/infrastructure/account.model';

@Table({ tableName: 'transaction' })
export class TransactionModel extends Model<TransactionModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionType)),
    allowNull: false,
  })
  type: TransactionType;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @ForeignKey(() => AccountModel)
  sender_id: number;

  @ForeignKey(() => AccountModel)
  receiver_id: number;

  @BelongsTo(() => AccountModel, { foreignKey: 'sender_id' })
  sender: AccountModel;

  @BelongsTo(() => AccountModel, { foreignKey: 'receiver_id' })
  receiver: AccountModel;
}
