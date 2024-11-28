import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithdrawalDTO {
  @ApiProperty({
    description: 'Tipo de transação, fixo: WITHDRAWAL',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(TransactionType.WITHDRAWAL)
  type: TransactionType.WITHDRAWAL;

  @ApiProperty({
    description: 'Valor do deposito, não permite números negativos',
    example: 10.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Conta a qual realizará o saque',
    example: '000000000001',
  })
  @IsString()
  @IsNotEmpty()
  number: string;
}
