import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";
import { SubCategoryEntity } from "../entity/category.entity";
import { SubCategoryService } from "../services/subcategory.service";
import { UpdateSubCategoryDTO } from "../dto/subcategorydto/updateSubCategory.dto";
import { CreateSubCategoryDTO } from "../dto/subcategorydto/createSubCategory.dto";
import { RefineQuery } from '../../../common/decorators/queryadmin.decorator';
import { IRefineInterface } from '../../products/interfaces/basequery.interface';
import { IPagination } from "../../../common/interfaces/pagination.interface";

@ApiTags('sub_category')
@ApiBearerAuth()
@Controller('sub_category')
@UseGuards(LocalAuthGuard ,RolesGuard)
export class SubCategoryController {
    constructor(private readonly subCategoryService: SubCategoryService) {}

    @Post()
    @Roles(roles.Admin)
    create(@Body() createSubCategoryDTO: CreateSubCategoryDTO ) {
        return this.subCategoryService.insertByDTO(createSubCategoryDTO);
    }

    @Get()
    @Roles(roles.Admin)
    getSubCategories(@Query() pagination?: IPagination){
        return this.subCategoryService.findAll(pagination);
    }

    @Get(':id')
    @Roles(roles.Admin)
    getSubCategoryById(@Param('id', new ParseUUIDPipe()) id: string): Promise<SubCategoryEntity> {
        return this.subCategoryService.findOneById(id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    @ApiResponse({status: 404, description: 'SubCategory not found or Refer Category not found'})
    updateSubCategory(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDTO): Promise<Partial<SubCategoryEntity>> {
        return this.subCategoryService.updateByDTO(id, updateSubCategoryDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteSubCategory(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.subCategoryService.softDelete(id);
    }
}
