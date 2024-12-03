import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { DiscountsService } from '../service/discounts.service';
import { setDiscountToProductDTO } from '../dto/discountsdto/setDiscountToProduct.dto';
import { DiscountEntity } from "../entity/discounts.entity";

@ApiTags('discounts')
@ApiBearerAuth()
@Controller('discounts')
@UseGuards(LocalAuthGuard, RolesGuard)
export class DiscountsController {
    constructor(private readonly discountService: DiscountsService) {}

    @Post()
    @Roles(roles.Admin)
    @ApiBody({ type: setDiscountToProductDTO })
    @ApiResponse({ status: 201, description: 'Created discount successfully' })
    public async createOffer(@Body() data: setDiscountToProductDTO): Promise<DiscountEntity> {
        return this.discountService.setDiscountToProduct(data);
    }
}
