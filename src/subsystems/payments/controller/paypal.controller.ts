// Import Line
import { Req, UseGuards, Controller, Get, Post, Query, Inject, HttpCode, HttpStatus, Res, Body } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { PaypalService } from '../service/paypal.service';
import { Response } from "express";

// Controller
@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaypalController {
    constructor(
        @Inject(PaypalService)
        public servicePaypal:PaypalService
    ) { }
    @UseGuards(LocalAuthGuard,RolesGuard)
    @Roles(roles.User)
    @Post("create-order")
    async createOrder(@Body() body:any ,@Res() res: Response,@Req() req:any ) {

        const link = await this.servicePaypal.CreateOrder(body.id,req.user.Id);

        res.send(link)
    }

    @Get("capture-order")
    @HttpCode(HttpStatus.OK)
    async captureOrder(@Query('token') token: string, @Query('PayerID') payerId: string) {
        // Usa el token y payerId según sea necesario
        const response = await this.servicePaypal.confirmorder(token);
        if(response == true){
          
            return{sucess:true}
        
        }   

    return { success: false, errorCode: 400 }
        

    }

    @Roles(roles.User)
    @Post("cancel-order")
    async cancelorder(){
        
    }
}
