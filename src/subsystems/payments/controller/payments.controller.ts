import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Query, ParseUUIDPipe, Get, Inject } from "@nestjs/common";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { PaymentsService } from "../service/payments.service";

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(LocalAuthGuard, RolesGuard)
export class PaymentsController{
    constructor(
        @Inject(PaymentsService)
        private paymentsService: PaymentsService,
    ) { }

    @Roles(roles.User)
    @Get("capture-payment")
    @ApiResponse({ status: 200, description: "Return success: true" })
    @ApiResponse({ status: 400, description: "Return success: false" })
    async capturePayment(@Query('order_id', new ParseUUIDPipe()) orderid: string) {
        return await this.paymentsService.confirmPayment(orderid);
    }
}