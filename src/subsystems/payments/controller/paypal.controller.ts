// Import Line
import { Req, UseGuards, Controller, Get, Post, Query, BadRequestException} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";


// Controller
@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(LocalAuthGuard,RolesGuard)

export class PaypalController {
    constructor (
    ) { }

    @Roles(roles.User)
    @Post("create-order")
    async createOrder(){
        
    }

        
    @Roles(roles.User)
    @Post("capture-order")
    async captureOrder(){
        
    }

        
    @Roles(roles.User)
    @Post("cancel-order")
    async cancelorder(){
        
    }
}