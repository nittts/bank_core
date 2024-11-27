import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCustomerDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/)
  document: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;
}
