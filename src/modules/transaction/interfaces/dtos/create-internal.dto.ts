import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInternalDTO {
  @ApiProperty({
    description: 'Tipo de transação, fixo: INTERNAL',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(TransactionType.INTERNAL)
  type: TransactionType.INTERNAL;

  @ApiProperty({
    description: 'Valor do deposito, não permite números negativos',
    example: 10.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Conta a qual enviará o valor',
    example: '000000000002',
  })
  @IsString()
  @IsNotEmpty()
  senderNumber: string;

  @ApiProperty({
    description: 'Conta a qual receberá o valor',
    example: '000000000001',
  })
  @IsString()
  @IsNotEmpty()
  receiverNumber: string;
}
