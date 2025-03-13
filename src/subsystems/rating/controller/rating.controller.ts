import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Roles } from "../../roles/decorators/roles.decorator";
import { RatingService } from "../services/rating.service";
import { roles } from "../../roles/enum/roles.enum";
import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RateProductDTO } from "../dto/rateProduct.dto";

@ApiTags('rating')
@ApiBearerAuth()
@Controller('rating')
@UseGuards(LocalAuthGuard, RolesGuard)
export class RatingController {
    constructor(private readonly ratingService: RatingService) {
    }

    @Post()
    @Roles(roles.User)
    async rateProduct(@Req() request: any, @Body() body: RateProductDTO) {
        const user = request.user.Id;
        return await this.ratingService.rateProducts(user, body);
    }

    @Get('avg')
    @Roles(roles.Admin)
    async getAverage(){
        return this.ratingService.getAvgRating();
    }

}
