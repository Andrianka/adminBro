import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CustomerService } from './customer/customer.service';

@Module({
  providers: [PaymentService, CustomerService],
})
export class PaymentModule {}
