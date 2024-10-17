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

  import { User } from '../entities/user.entity';

  import { CreateUserDto } from '../dto/create-user.dto';
  import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';

  
  
  
  @ApiTags('user')
  @ApiBearerAuth()
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) { }
  
    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.userService.createUser(createUserDto);
    }
  
    //@UseGuards(JwtAuthGuard)
    @Get()
    public getUsers(): Promise<User[]> {
      return this.userService.getUsers();
    }
  
  
    @Get(':id')
    getUserById(@Param('id') id: string) {
      return this.userService.findUserById(+id);
    }
  
  
    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.updateUser(+id, updateUserDto);
    }
  
  
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
      //return this.userService.deleteUser(+id);
      return this.userService.softDelete(+id);
    }
  }