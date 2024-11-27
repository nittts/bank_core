import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AccountModule, CustomerModule],
  exports: [AccountModule, CustomerModule],
})
export class ModulesModule {}
