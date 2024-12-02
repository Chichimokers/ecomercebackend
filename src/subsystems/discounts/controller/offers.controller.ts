import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";


@ApiTags('offers')
@ApiBearerAuth()
@Controller('offers')
@UseGuards(LocalAuthGuard,RolesGuard)
export class OffersController {
    constructor() { }


}