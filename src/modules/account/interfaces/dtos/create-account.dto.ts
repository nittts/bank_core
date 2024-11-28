import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAccountDTO {
  @ApiProperty({
    description: 'N° da conta cliente dona da conta',
    example: 1,
  })
  @IsNumber()
  ownerId: number;
}
