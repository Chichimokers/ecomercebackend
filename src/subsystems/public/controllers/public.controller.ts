// Import Line

import { UseGuards, Controller, Get, Post} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { PublicService } from "../services/public.service";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";

// Controller

@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
@UseGuards(LocalAuthGuard,RolesGuard)

export class PublicController {
    constructor (private readonly publicService: PublicService) { }

    // Get User Order History
    @Get('/orders/:id')
    @Roles(roles.User)
    public getOrders() {

    }

    // Create Order
    @Post()
    @Roles(roles.User)
    public createOrder() {

    }
}