import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { AccountModel } from 'src/modules/account/infrastructure/account.model';

@Table({ tableName: 'customer' })
export class CustomerModel extends Model<CustomerModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING({ length: 160 }),
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING({ length: 11 }),
    allowNull: false,
    unique: true,
  })
  document: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'birth_date',
  })
  birthDate: Date;

  @HasMany(() => AccountModel)
  accounts: AccountModel[];
}
