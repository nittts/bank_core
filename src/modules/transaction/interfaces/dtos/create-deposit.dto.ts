import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class CreateDepositDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(TransactionType.DEPOSIT)
  type: TransactionType.DEPOSIT;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  number: string;
}
