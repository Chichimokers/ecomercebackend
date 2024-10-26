// Import Line
import { Req, UseGuards, Controller, Get, Post, Query, BadRequestException, Param, Redirect, Inject, HttpCode, HttpStatus, Res, Body } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiExpectationFailedResponse } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { CLIENTID, HOST , PAYPAL_HOST, SECRET_KEY} from "../config.payments"
import axios from "axios";
import { URLSearchParams } from "url";
import { PaypalService } from '../service/paypal.service';
import { Request, Response } from "express";
import { paydto } from "../dto/paydto";
// Controller
@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(LocalAuthGuard,RolesGuard)
export class PaypalController {
    constructor(
        @Inject(PaypalService)
        public servicePaypal:PaypalService
    ) { }

        @Roles(roles.User)
        @Post("create-order")
        async createOrder(@Body() body:paydto ,@Res() res: Response,@Req() req:any ) {

            const link = await this.servicePaypal.CreateOrder(body.id,req.user.Id);
          
           res.send(link)
        }
    
    
            


        @Get("capture-order")
        @HttpCode(HttpStatus.OK)
        async captureOrder(@Query('token') token: string, @Query('PayerID') payerId: string) {
            // Usa el token y payerId según sea necesario
            const response = await this.servicePaypal.confirmorder(token);

            // Verifica si la respuesta es verdadera
            if (response) {
                return { success: true }; // Respuesta exitosa
            } else {
                return { success: false, errorCode: 400 }; // Código de error, puedes ajustar según sea necesario
            }
        }
    

        
    @Roles(roles.User)
    @Post("cancel-order")
    async cancelorder(){
        
    }
}
