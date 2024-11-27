import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerModel } from './infrastructure/customer.model';
import { CustomerController } from './presentation/customer.controller';
import { CustomerService } from './application/customer.service';
import { ICustomerRepository } from './domain/customer.repository';
import { CustomerRepository } from './infrastructure/customer.repository';
import { AccountModel } from '../account/infrastructure/account.model';

@Module({
  imports: [SequelizeModule.forFeature([CustomerModel, AccountModel])],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    { provide: ICustomerRepository, useClass: CustomerRepository },
  ],
  exports: [CustomerService, ICustomerRepository],
})
export class CustomerModule {}
