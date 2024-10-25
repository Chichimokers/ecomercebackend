import { Module } from '@nestjs/common';
import { PaypalService } from './service/paypal.service';
import { PaypalController } from './controller/paypal.controller';

@Module({
    providers:[PaypalService],
    controllers:[PaypalController]
})
export class PaymentsModule {}
