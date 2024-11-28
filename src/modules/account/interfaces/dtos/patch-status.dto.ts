import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountStatus } from '../../domain/enums/account-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PatchStatusDTO {
  @ApiProperty({
    description: 'Status da conta para ser atualizada',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status: AccountStatus;
}
