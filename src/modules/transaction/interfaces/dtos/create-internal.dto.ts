import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class CreateInternalDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(TransactionType.INTERNAL)
  type: TransactionType.INTERNAL;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  senderNumber: string;

  @IsString()
  @IsNotEmpty()
  receiverNumber: string;
}
