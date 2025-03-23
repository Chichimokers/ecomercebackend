// Import Line
import {
    Req,
    UseGuards,
    Controller,
    Get,
    Post,
    Query,
    Inject,
    HttpCode,
    HttpStatus,
    Res,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { PaypalService } from '../service/paypal.service';
import { Response } from 'express';
import { ConfirmOrder } from '../interfaces/confirmOrderPaypal';

// Controller
@ApiTags('paypal')
@ApiBearerAuth()
@Controller('paypal')
export class PaypalController {
    constructor(
        @Inject(PaypalService)
        public servicePaypal: PaypalService,
    ) { }
    //Endpoint para empezar a pagar la orden solo se le mnada el id de la orden en el body de la peticion
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(roles.User)
    @Post('create-order')
    async createOrder(
        @Body() body: any,
        @Req() req: any,
        @Res() res: Response,
    ): Promise<any> {

        const link: string = await this.servicePaypal.CreateOrder(
            body.id,
            req.user.Id,
        );

         res.redirect(link)
    }

    @Get('capture-order')
    @HttpCode(HttpStatus.MOVED_PERMANENTLY)
    async captureOrder(
        @Query('token') token: string,
        @Query('PayerID') payerId: string,

        @Res() res: Response,
    ) {
        // Usa el token y payerId según sea necesario
        const response: ConfirmOrder = await this.servicePaypal.confirmorder(token);
        if (response.paid) {
            res.redirect(process.env.SUCCESS_URL + "?order_id=" + response.orderid)
        }

    }
    //Cancelar orden cuando el usuario cancela desde paypal 
    @Get('cancel-order')
    async cancelorder(@Query() query: any,   @Res() res: Response): Promise<any> {

        //const token = query.token; // Parámetro clave

        //await this.servicePaypal.cancelorder(token);

       // return process.env.WEB
       res.redirect(`${process.env.WEB}/orders`)

    }
}
