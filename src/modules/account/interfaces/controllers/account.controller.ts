import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from '../../application/account.service';
import { CreateAccountDTO } from '../dtos/create-account.dto';
import { PatchStatusDTO } from '../dtos/patch-status.dto';
import { QueryAccountDTO } from '../dtos/query-account.dto';

@Controller('contas')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/')
  async createAccount(@Body() payload: CreateAccountDTO) {
    return this.accountService.createAccount(payload);
  }

  @Patch('/:id')
  async patchAccountStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: PatchStatusDTO,
  ) {
    return this.accountService.patchAccountStatus(id, payload);
  }

  @Get('/:id')
  async getAccount(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: QueryAccountDTO,
  ) {
    return this.accountService.findByIdWithRelations(
      id,
      query.includeOwner,
      query.includeTransactions,
    );
  }
}
