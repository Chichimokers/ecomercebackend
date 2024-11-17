import {
    UseGuards,
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(LocalAuthGuard,RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiCreatedResponse({ description: 'The record has been created successfully created' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Post()
    @Roles(roles.Admin)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    @Roles(roles.Admin)
    public getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Get(':id')
    @Roles(roles.Admin)
    getUserById(@Param('id') id: string) {
        return this.userService.findUserById(+id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(+id, updateUserDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteUser(@Param('id') id: string) {
        //return this.userService.deleteUser(+id);
        return this.userService.softDelete(+id);
    }
}