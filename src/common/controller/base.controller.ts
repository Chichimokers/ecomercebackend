import { BaseService } from '../services/base.service';
import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Roles } from '../../subsystems/roles/decorators/roles.decorator';
import { roles } from '../../subsystems/roles/enum/roles.enum';
import { BaseDto } from '../dto/base.dto';
import { Type } from 'class-transformer';

// TODO Finish this
export abstract class BaseController<T> {
    protected constructor(
        private readonly service: BaseService<T>,
    ) { }

    @Get()
    @Roles(roles.Admin)
    findAll(): Promise<T[]> {
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(roles.Admin)
    findById(@Param('id') id: string): Promise<T> {
        return this.service.findOneById(id);
    }

    @Post()
    @Roles(roles.Admin)
    create(@Body() createDTO: T): Promise<T> {
        return this.service.create(createDTO);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    update(
        @Param('id') id: string,
        @Body() updateDTO: T,
    ): Promise<Partial<T>> {
        return this.service.update(id, updateDTO);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    delete(@Param('id') id: string): Promise<void> {
        return this.service.softDelete(id);
    }
}