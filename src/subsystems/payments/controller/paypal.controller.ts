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

// Controller
@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaypalController {
    constructor(
        @Inject(PaypalService)
        public servicePaypal: PaypalService,
    ) { }

    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(roles.User)
    @Post('create-order')
    async createOrder(
        @Body() body: any,
        @Res() res: Response,
        @Req() req: any,
    ): Promise<void> {
        
        const link: string = await this.servicePaypal.CreateOrder(
            body.id,
            req.user.Id,
        );

        
        res.redirect(link)
    }

    @Get('capture-order')
    @HttpCode(HttpStatus.OK)
    async captureOrder(
        @Query('token') token: string,
        @Query('PayerID') payerId: string,
    ) {
        // Usa el token y payerId según sea necesario
        const response: boolean = await this.servicePaypal.confirmorder(token);

        return response
            ? { success: true }
            : { success: false, errorCode: 400 };
    }

    @Post('cancel-order')
    async cancelorder(@Query() query: any,@Res() res: Response): Promise<void> {

        const token = query.token; // Parámetro clave
   
        const response: boolean = await this.servicePaypal.cancelorder(token);

        res.redirect(process.env.WEB)


     }
}
