import { Module } from '@nestjs/common';
import { PaypalService } from './service/paypal.service';
import { PaypalController } from './controller/paypal.controller';
import { StripeService } from "./service/stripe.service";
import { StripeController } from "./controller/stripe.controller";

@Module({
    providers:[PaypalService, StripeService],
    controllers:[PaypalController, StripeController]
})
export class PaymentsModule {}
