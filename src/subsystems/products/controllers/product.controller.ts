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
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { roles } from 'src/subsystems/roles/enum/roles.enum';

  
  
  @ApiTags('products')
  @ApiBearerAuth()
  @Controller('products')
  @UseGuards(LocalAuthGuard)
  @UseGuards(RolesGuard)
  export class ProductControllers {
    constructor(private readonly productservice: ProductService) { }
  
    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Post()
    @Roles(roles.Admin)
    create(@Body() createUserDto: createProductDTO) {
      return this.productservice.create(createUserDto);

    }
  
    //@UseGuards(JwtAuthGuard)
    @Get()
    @Roles(roles.Admin)
    public getUsers(): Promise<ProductEntity[]> {
      return this.productservice.findAll();
    }
  
  
    @Get(':id')
    @Roles(roles.Admin)
    getUserById(@Param('id') id: string) {
      return this.productservice.findOneById(+id);
    }
  
  
    @Patch(':id')
    @Roles(roles.Admin)
    updateUser(@Param('id') id: string, @Body() updateUserDto: updateProductDTO) {
      return this.productservice.update(+id, updateUserDto);
    }
  
  
    @Delete(':id')
    @Roles(roles.Admin)
    deleteUser(@Param('id') id: string) {
      //return this.userService.deleteUser(+id);
      return this.productservice.softDelete(+id);
    }
  }