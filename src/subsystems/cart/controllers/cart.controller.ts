import {
    UseGuards,
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Delete,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse
  } from '@nestjs/swagger';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { CartService } from '../services/cart.service';
import { addCartDTO } from '../dto/createCartDTO';
import { CartEntity } from '../entity/cart.entity';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';


  
  
  @ApiTags('cart')
  @ApiBearerAuth()
  @Controller('cart')
  @UseGuards(LocalAuthGuard)
  @UseGuards(RolesGuard)
  export class ProductControllers {
    constructor(private readonly productservice: CartService) { }
  
    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    
    @Post()
    @Roles(roles.Admin)
    create(@Body() createUserDto: addCartDTO) {
      return this.productservice.create(createUserDto);
    }
  

    
    //@UseGuards(JwtAuthGuard)
    @Get()
    @Roles(roles.Admin)
    public getUsers(): Promise<CartEntity[]> { 
      return this.productservice.findAll();
    }
  
  
    @Get(':id')
    @Roles(roles.Admin)
    getUserById(@Param('id') id: string) {
      return this.productservice.findOneById(+id);
    }
  
  
    @Patch(':id')
    @Roles(roles.Admin)
    updateUser(@Param('id') id: string, @Body() updateUserDto) {
      return this.productservice.update(+id, updateUserDto);
    }
  
  
    @Delete(':id')
    @Roles(roles.Admin)
    deleteUser(@Param('id') id: string) {
      //return this.userService.deleteUser(+id);
      return this.productservice.softDelete(+id);
    }
  }