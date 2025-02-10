import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CategoryService } from '../services/category.service';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { CreateCategoryDTO } from '../dto/categorydto/createCategory.dto';
import { CategoryEntity } from '../entity/category.entity';
import { UpdateCategoryDTO } from '../dto/categorydto/updateCategory.dto';
import { RefineQuery } from '../../../common/decorators/queryadmin.decorator';
import { BaseQueryInterface } from '../../../common/interfaces/basequery.interface';

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
@UseGuards(LocalAuthGuard, RolesGuard)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @Roles(roles.Admin)
    create(@Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoryService.create(createCategoryDTO);
    }

    @Get()
    @Roles(roles.Admin)
    getCategories(@RefineQuery() query: BaseQueryInterface) {
        const { _start, _end } = query;
        return this.categoryService.findAll(_start, _end);
    }

    @Get(':id')
    @Roles(roles.Admin)
    getCategoryById(@Param('id') id: string): Promise<CategoryEntity> {
        return this.categoryService.findOneById(id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDTO,
    ): Promise<Partial<CategoryEntity>> {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteCategory(@Param('id') id: string): Promise<void> {
        return this.categoryService.softDelete(id);
    }
}
