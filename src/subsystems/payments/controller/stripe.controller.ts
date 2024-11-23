import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Post, Body, Query } from "@nestjs/common";
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
        return await this.stripeService.createCheckoutSession(orderid);
    }

    @Roles(roles.User)
    @Post("capture-payment")
    async capturePayment(@Body('sessionId') sessionId: string) {
        const response = await this.stripeService.CaptureCheckoutSession(sessionId);

        return response.checkout.status ? { success: true } : { success: false, errorCode: 400 };
    }
}