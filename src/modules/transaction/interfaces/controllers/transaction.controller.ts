import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TransactionService } from '../../application/transaction.service';
import { CreateInternalDTO } from '../dtos/create-internal.dto';
import { CreateWithdrawalDTO } from '../dtos/create-withdrawal.dto';
import { CreateDepositDTO } from '../dtos/create-deposit.dto';

@Controller('movimentacoes')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/deposito')
  async performDeposit(@Body() payload: CreateDepositDTO) {
    return this.transactionService.performDeposit(payload);
  }

  @Post('/saque')
  async performWithdrawal(@Body() payload: CreateWithdrawalDTO) {
    return this.transactionService.performWithDrawal(payload);
  }

  @Post('/transferencia')
  async performInternal(@Body() payload: CreateInternalDTO) {
    return this.transactionService.performInternal(payload);
  }

  @Get('/:id')
  async getTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findTransaction(id);
  }
}
