import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class CreateWithdrawalDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(TransactionType.WITHDRAWAL)
  type: TransactionType.WITHDRAWAL;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  number: string;
}
