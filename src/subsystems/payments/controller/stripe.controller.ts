import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Post, Body, Query } from "@nestjs/common";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { StripeService } from "../service/stripe.service";
import { StripeDTO } from "../dto/stripedto.dto";

@ApiTags('visa-mastercard')
@ApiBearerAuth()
@Controller('visa-mastercard')
@UseGuards(LocalAuthGuard, RolesGuard)

export class StripeController{
    constructor(private readonly stripeService: StripeService) { }

    @Roles(roles.Admin)
    @Post("create-payment")
    async createPayment(@Body() order: StripeDTO) {
        return await this.stripeService.createCheckoutSession(order.id);
    }

    // @Roles(roles.User)
    @Post("capture-payment")
    async capturePayment(@Query('order_id') orderId: number) {
        console.log(orderId);
        const response = await this.stripeService.CaptureCheckoutSession(orderId);
        return response.checkout.status ? { success: true } : { success: false, errorCode: 400 };
    }
}