import {
    UseGuards,
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse
} from '@nestjs/swagger';
import { CartService } from '../services/cart.service';
import { CartEntity } from '../entity/cart.entity';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { updateCartDto } from '../dto/updateCartDTO';
import { addCartDTO } from '../dto/addCartDTO.dto';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(LocalAuthGuard,RolesGuard)
export class CartController {
    constructor(private readonly productservice: CartService) { }

    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Post()
    @Roles(roles.User)
    create(@Body() addCarDTO: addCartDTO, @Req() req:any) {
        return this.productservice.addToCart(addCarDTO,req.user.Id);
    }

    //@UseGuards(JwtAuthGuard)
    @Get()
    @Roles(roles.Admin)
    public getCart(): Promise<CartEntity[]> {
        return this.productservice.findAll();
    }

    @Get(':id')
    @Roles(roles.Admin)
    getCartById(@Param('id') id: string) {
        return this.productservice.findOneById(+id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateCart(@Param('id') id: string, @Body() updateCartDto: updateCartDto) {
        return this.productservice.update(+id, updateCartDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteCart(@Param('id') id: string) {
        return this.productservice.softDelete(+id);
    }
}