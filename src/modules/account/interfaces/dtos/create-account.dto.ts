import { IsNumber } from 'class-validator';

export class CreateAccountDTO {
  @IsNumber()
  ownerId: number;
}
