import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerService } from '../../application/customer.service';
import { CreateCustomerDTO } from '../dtos/create-customer.dto';

import { AuthType } from '../../../auth/domain/enum/auth-type';
import { Auth } from 'src/shared/decorators/auth.decorator';

import { QueryCustomerDTO } from '../dtos/query-customer.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('clientes')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/')
  @Auth(AuthType.None)
  async createCustomer(@Body() payload: CreateCustomerDTO) {
    return await this.customerService.createCustomer(payload);
  }

  @Get('/:id')
  @ApiBearerAuth('token')
  async getCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: QueryCustomerDTO,
  ) {
    return await this.customerService.getCustomerByIdWithRelations(
      id,
      query.includeAccounts,
    );
  }
}
