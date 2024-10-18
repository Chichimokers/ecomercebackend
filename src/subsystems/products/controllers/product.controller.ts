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
import { ProductService } from '../services/product.service';
import { CreateUserDto } from 'src/subsystems/user/dto/create-user.dto';
import { ProductEntity } from '../entity/product.entity';
import { createProductDTO } from '../dto/createProductDTO';
import { updateProductDTO } from '../dto/updateProductDTO';

  
  
  @ApiTags('products')
  @ApiBearerAuth()
  @Controller('products')
  export class ProductControllers {
    constructor(private readonly productservice: ProductService) { }
  
    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Post()
    create(@Body() createUserDto: createProductDTO) {
      return this.productservice.create(createUserDto);

    }
  
    //@UseGuards(JwtAuthGuard)
    @Get()
    public getUsers(): Promise<ProductEntity[]> {
      return this.productservice.findAll();
    }
  
  
    @Get(':id')
    getUserById(@Param('id') id: string) {
      return this.productservice.findOneById(+id);
    }
  
  
    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: updateProductDTO) {
      return this.productservice.update(+id, updateUserDto);
    }
  
  
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
      //return this.userService.deleteUser(+id);
      return this.productservice.softDelete(+id);
    }
  }