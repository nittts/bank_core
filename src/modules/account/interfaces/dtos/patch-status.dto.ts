import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountStatus } from '../../domain/enums/account-status.enum';

export class PatchStatusDTO {
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status: AccountStatus;
}
