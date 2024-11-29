import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryTransactionDTO {
  @ApiProperty({
    description:
      'Denominando se a rota deve retornar as contas relacionadas à transação.',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Value must be a boolean' })
  @Transform(({ value }) => Boolean(value))
  includeAccounts?: boolean;
}
