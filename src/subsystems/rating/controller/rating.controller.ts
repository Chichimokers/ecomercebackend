import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "../../roles/decorators/roles.decorator";
import { RatingService } from "../services/rating.service";
import { roles } from "../../roles/enum/roles.enum";
import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('rating')
@ApiBearerAuth()
@Controller('rating')
@UseGuards(LocalAuthGuard, RolesGuard)
export class RatingController {
    constructor(private readonly ratingService: RatingService) {
    }

    @Get('avg')
    @Roles(roles.Admin)
    async getAverage(){
        return this.ratingService.getAvgRating();
    }

}
