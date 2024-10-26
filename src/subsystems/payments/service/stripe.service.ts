import Stripe from 'stripe';
import { Injectable } from "@nestjs/common";

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe("", {
            apiVersion: '2024-09-30.acacia',
        });
    }

    async createPaymentIntent(amount: number, currency: string='usd') {
        return await this.stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });
    }
}