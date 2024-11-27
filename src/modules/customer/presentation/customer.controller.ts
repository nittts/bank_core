import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CustomerService } from '../application/customer.service';
import { CreateCustomerDTO } from '../shared/dto/create-customer.dto';

@Controller('clientes')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/')
  async createCustomer(@Body() payload: CreateCustomerDTO) {
    return await this.customerService.createCustomer(payload);
  }

  @Get('/:id')
  async getCustomer(@Param('id', ParseIntPipe) id: number) {
    return await this.customerService.getCustomer(id);
  }
}
