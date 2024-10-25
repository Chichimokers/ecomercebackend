// Import Line
import { Req, UseGuards, Controller, Get, Post, Query, BadRequestException, Param, Redirect } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiExpectationFailedResponse } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { CLIENTID, HOST , PAYPAL_HOST, SECRET_KEY} from "../config.payments"
import axios from "axios";
import { URLSearchParams } from "url";
// Controller
@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(LocalAuthGuard, RolesGuard)

export class PaypalController {
    constructor(
    ) { }

    @Roles(roles.User)
    @Post("create-order")
    async createOrder() {

        const order = {
            intent: "CAPTURE",
            purchase_unit: [

                {
                
                    amount: {
                        concurrency_code: "USD",
                        value: "100.0"
                    }

                }

            ],
            application_context: {

                brand_name: "ESAKISHOP",
                landing_page: "NO_PREFERENCE",
                user_action: "pay_now",
                return_url: `${HOST}/payments/capture-order`,
                cancel_url: `${HOST}/payments/cancel-order`
            }
            

        }
        //Obteniendo Token
        const paramas = new URLSearchParams();
        paramas.append("grant_type","client_credentials");
        const auth  = { 

            username:CLIENTID,
            password:SECRET_KEY
        }
         const { data: access_token } =   await axios.post(`${PAYPAL_HOST}+/v1/oauth2/token`,paramas,{
            auth:auth
        })
        //Creando token
        const response =  await axios.post(`${PAYPAL_HOST}+/v2/checkout/orders`,order,{
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        })

        Redirect(response.data.links[1]);
    }
            

        
    @Roles(roles.User)
    @Post("capture-order")
    async captureOrder(@Param('token') token: string, @Param('PayerID') payerId: string){
        
        const auth  = { 

            username:CLIENTID,
            password:SECRET_KEY
        }
        axios.post(`${PAYPAL_HOST}/v2/checkout/orders/${token}/capture`,{},{
            auth:auth
        })
    }

        
    @Roles(roles.User)
    @Post("cancel-order")
    async cancelorder(){
        
    }
}