import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateDepositDTO {
  @ApiProperty({
    description: 'Tipo de transação, fixo: DEPOSIT',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(TransactionType.DEPOSIT)
  type: TransactionType.DEPOSIT;

  @ApiProperty({
    description: 'Valor do deposito, não permite números negativos',
    example: 10.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Conta a qual será realizado o deposito',
    example: '000000000001',
  })
  @IsString()
  @IsNotEmpty()
  number: string;
}
