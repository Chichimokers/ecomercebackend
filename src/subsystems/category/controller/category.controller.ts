import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param, ParseUUIDPipe,
    Patch,
    Post, Query,
    UseGuards
} from "@nestjs/common";
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CategoryService } from '../services/category.service';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { CreateCategoryDTO } from '../dto/categorydto/createCategory.dto';
import { CategoryEntity } from '../entity/category.entity';
import { UpdateCategoryDTO } from '../dto/categorydto/updateCategory.dto';
import { IPagination } from "../../../common/interfaces/pagination.interface";

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
@UseGuards(LocalAuthGuard, RolesGuard)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @Roles(roles.Admin)
    create(@Body() createCategoryDTO: CreateCategoryDTO): Promise<CategoryEntity> {
        try {
            return this.categoryService.create(createCategoryDTO);
        } catch (QueryFailedError) {
            throw new BadRequestException('The name already exists');
        }
    }

    @Get()
    @Roles(roles.Admin)
    getCategories(@Query() pagination?: IPagination): Promise<CategoryEntity[]> {
        return this.categoryService.findAll(pagination);
    }

    @Get(':id')
    @Roles(roles.Admin)
    getCategoryById(@Param('id', new ParseUUIDPipe()) id: string): Promise<CategoryEntity> {
        return this.categoryService.findOneById(id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateCategory(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateCategoryDto: UpdateCategoryDTO,
    ): Promise<Partial<CategoryEntity>> {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteCategory(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.categoryService.softDelete(id);
    }
}
