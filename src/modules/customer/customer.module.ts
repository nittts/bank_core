import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CustomerModel } from './infrastructure/customer.model';
import { CustomerController } from './interfaces/controllers/customer.controller';
import { CustomerService } from './application/customer.service';
import { ICustomerRepository } from './domain/customer.repository';
import { CustomerRepository } from './infrastructure/customer.repository';
import { CustomerMapper } from './interfaces/mappers/customer.mapper';

import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CustomerModel]),
    forwardRef(() => AccountModule),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerMapper,
    CustomerService,
    { provide: ICustomerRepository, useClass: CustomerRepository },
  ],
  exports: [CustomerMapper, CustomerService, ICustomerRepository],
})
export class CustomerModule {}
