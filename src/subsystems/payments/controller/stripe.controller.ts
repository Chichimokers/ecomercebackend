import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { StripeService } from "../service/stripe.service";

@ApiTags('visa-mastercard')
@ApiBearerAuth()
@Controller('visa-mastercard')
@UseGuards(LocalAuthGuard, RolesGuard)

export class StripeController{
    constructor(private readonly stripeService: StripeService) { }

    @Roles(roles.User)
    @Post("create-payment")
    async createPayment(@Body('orderid') orderid: number) {
        const paymentIntent = await this.stripeService.createPaymentIntent(orderid);

        return paymentIntent;
    }
}