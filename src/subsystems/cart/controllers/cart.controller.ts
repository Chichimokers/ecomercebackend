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


  
  
  @ApiTags('products')
  @ApiBearerAuth()
  @Controller('products')
  export class ProductControllers {
    constructor(private readonly productservice: CartService) { }
  
    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    
    @Post()
    create(@Body() createUserDto: addCartDTO) {
      return this.productservice.create(createUserDto);
    }
  

    
    //@UseGuards(JwtAuthGuard)
    @Get()
    public getUsers(): Promise<CartEntity[]> { 
      return this.productservice.findAll();
    }
  
  
    @Get(':id')
    getUserById(@Param('id') id: string) {
      return this.productservice.findOneById(+id);
    }
  
  
    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() updateUserDto) {
      return this.productservice.update(+id, updateUserDto);
    }
  
  
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
      //return this.userService.deleteUser(+id);
      return this.productservice.softDelete(+id);
    }
  }