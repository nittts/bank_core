import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Documento (CPF) do cliente sem formatação.',
    example: '99999999999',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/)
  document: string;

  @ApiProperty({
    description: 'Senha do cliente',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
