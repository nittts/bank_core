import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCustomerDTO {
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'Fulano da Silva',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Documento (CPF) do cliente sem formatação.',
    example: '99999999999',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/)
  document: string;

  @ApiProperty({
    description: 'Data de nascimento do cliente',
    example: '2024-11-28T15:24:20.789234Z',
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;
}
