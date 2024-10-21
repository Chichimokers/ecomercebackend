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

import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { OrderService } from '../services/orders.service';
import { CreateOrderDTO } from '../dto/CreateOrderDTO';
import { OrderEntity } from '../entities/order.entity';
import { updateOrderDTO } from '../dto/updateOrderDTO';


  
  
  @ApiTags('orders')
  @ApiBearerAuth()
  @Controller('orders')
  @UseGuards(LocalAuthGuard)
  @UseGuards(RolesGuard)
  
  export class OrderControllers {
    constructor(private readonly productservice: OrderService) { }
  
    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    
    @Post()
    @Roles(roles.Admin)
    create(@Body() createUserDto: CreateOrderDTO) {
      return this.productservice.create(createUserDto);
    }
  

    
    //@UseGuards(JwtAuthGuard)
    @Get()
    @Roles(roles.Admin)
    public getUsers(): Promise<OrderEntity[]> { 
      return this.productservice.findAll();
    }
  
  
    @Get(':id')
    @Roles(roles.Admin)
    getUserById(@Param('id') id: string) {
      return this.productservice.findOneById(+id);
    }
  
  
    @Patch(':id')
    @Roles(roles.Admin)

    updateOrder(@Param('id') id: string, @Body() updateorder:updateOrderDTO) {
      return this.productservice.update(+id, updateorder);
    }
  
  
    @Delete(':id')
    @Roles(roles.Admin)
    deleteUser(@Param('id') id: string) {
      //return this.userService.deleteUser(+id);
      return this.productservice.softDelete(+id);
    }
  }