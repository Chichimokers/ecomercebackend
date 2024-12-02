/*import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { setOfferToProductDTO } from "../dto/offersdto/setOfferToProduct.dto";
import { OffersService } from "../service/offers.service";
import { Roles } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";


@ApiTags('offers')
@ApiBearerAuth()
@Controller('offers')
@UseGuards(LocalAuthGuard,RolesGuard)
export class OffersController {
    constructor(private readonly offerService: OffersService) { }

    // Set Offer to a product
    @Post()
    @Roles(roles.Admin)
    @ApiBody({ type: setOfferToProductDTO })
    @ApiResponse({status: 201, description: "Created offer successfully"})
    public async createOffer(@Body() data: setOfferToProductDTO){
        return this.offerService.setOfferToProduct(data);
    }

    // Get Offers

}*/