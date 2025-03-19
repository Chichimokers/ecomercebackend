import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Post, Body, Query, Res } from "@nestjs/common";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { StripeService } from "../service/stripe.service";
import { CreatedCheckoutDTO, StripeDTO } from "../dto/stripedto.dto"
import { Response } from 'express';

@ApiTags('visa-mastercard')
@ApiBearerAuth()
@Controller('visa-mastercard')
@UseGuards(LocalAuthGuard, RolesGuard)
export class StripeController{
    constructor(private readonly stripeService: StripeService) { }

    @Roles(roles.User)
    @Post("create-payment")
    @ApiResponse({ status: 201, type: CreatedCheckoutDTO })
    async createPayment(@Body() order: StripeDTO) {
        return await this.stripeService.createCheckoutSession(order.id);
    }

    @Roles(roles.User)
    @Post("capture-payment")
    @ApiResponse({ status: 200, description: "Return success: true" })
    @ApiResponse({ status: 400, description: "Return success: false" })
    async capturePayment(@Query('order_id') orderid: string) {
        const response = await this.stripeService.CaptureCheckoutSession(orderid);
        return response.checkout.status ? { success: true } : { success: false, errorCode: 400 };
    }
}