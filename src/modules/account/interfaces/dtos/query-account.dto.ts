import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryAccountDTO {
  @ApiProperty({
    description:
      'Denominando se a rota deve retornar o dono da conta em questão.',
    example: true,
  })
  @IsOptional() // Make it optional
  @IsBoolean({ message: 'Value must be a boolean' })
  @Transform(({ value }) => Boolean(value))
  includeOwner?: boolean;

  @ApiProperty({
    description:
      'Denominando se a rota deve retornar as transações relacionadas com a conta.',
    example: true,
  })
  @IsOptional() // Make it optional
  @IsBoolean({ message: 'Value must be a boolean' })
  @Transform(({ value }) => Boolean(value))
  includeTransactions?: boolean;
}
