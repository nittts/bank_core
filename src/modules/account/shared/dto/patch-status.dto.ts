import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountStatus } from '../enums/account-status.enum';

export class PatchStatusDTO {
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status: AccountStatus;
}
