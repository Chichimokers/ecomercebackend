import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";
import { SubCategoryEntity } from "../entity/category.entity";
import { SubCategoryService } from "../services/subcategory.service";
import { UpdateSubCategoryDTO } from "../dto/subcategorydto/updateSubCategory.dto";
import { CreateSubCategoryDTO } from "../dto/subcategorydto/createSubCategory.dto";

@ApiTags('sub_category')
@ApiBearerAuth()
@Controller('sub_category')
@UseGuards(LocalAuthGuard, RolesGuard)
export class SubCategoryController {
    constructor(private readonly subCategoryService: SubCategoryService) {}

    @Post()
    @Roles(roles.Admin)
    create(@Body() createSubCategoryDTO: CreateSubCategoryDTO ) {
        return this.subCategoryService.create(createSubCategoryDTO);
    }

    @Get()
    @Roles(roles.Admin)
    getSubCategories(){
        return this.subCategoryService.findAll();
    }

    @Get(':id')
    @Roles(roles.Admin)
    getSubCategoryById(@Param('id') id: string): Promise<SubCategoryEntity> {
        return this.subCategoryService.findOneById(+id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateSubCategory(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDTO): Promise<Partial<SubCategoryEntity>> {
        return this.subCategoryService.update(+id, updateSubCategoryDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteSubCategory(@Param('id') id: string): Promise<void> {
        return this.subCategoryService.softDelete(id);
    }
}
