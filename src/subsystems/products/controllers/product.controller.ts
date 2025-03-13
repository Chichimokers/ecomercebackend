import {
    UseGuards,
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile, Get, ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiConsumes, ApiResponse,
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductEntity } from '../entity/product.entity';
import { CreateProductDTO } from '../dto/createProductDTO.dto';
import { UpdateProductDTO } from '../dto/updateProductDTO.dto';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from "multer";
import { ProductDTO } from '../../public/dto/frontsDTO/productsDTO/getproducts.dto';
import { IProductsFilters } from "../interfaces/basequery.interface";
import { WebpInterceptor } from '../interceptors/imagewebp.interceptor';
import { ProductPublicApiDoc, ProductPublicQuery } from "../decorators/public.decorator";
import { badRequestException } from "../../../common/exceptions/modular.exception";
import { IFilterProduct } from "../../../common/interfaces/filters.interface";

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(LocalAuthGuard,RolesGuard)
export class ProductControllers {

    constructor(private readonly productservice: ProductService) { }

    @ApiCreatedResponse({ description: 'Los registros han sido creados exitosamente' })
    @ApiForbiddenResponse({ description: 'Prohibido' })
    @ApiConsumes('multipart/form-data')
    @Post()
    @Roles(roles.Admin)
    @UseInterceptors(FileInterceptor('image', {
        storage: memoryStorage(),
    }),  WebpInterceptor)
    create(@Body() createProductDTO: CreateProductDTO, @UploadedFile() file?: Express.Multer.File): Promise<ProductEntity> {

        createProductDTO.image = file ? file.filename : undefined; // Asigna el nombre del archivo si existe

        return this.productservice.insertByDTO(createProductDTO);
    }

    @Get()
    @Roles(roles.Admin)
    @ProductPublicApiDoc()
    @ApiResponse({ status: 200, type: [ProductDTO] })
    public getProducts(@ProductPublicQuery() query: IProductsFilters): Promise<ProductEntity[]> {
        if (query.categoryIds)
            badRequestException(query.categoryIds, 'CategoryIDS');
        if (query.subCategoryIds)
            badRequestException(query.subCategoryIds, 'SubCategoryIDS');
        if (query.prices) badRequestException(query.prices, 'Prices');

        const filters: IFilterProduct = {
            categoryIds: query.categoryIds,
            subCategoryIds: query.subCategoryIds,
            prices: query.prices,
            rate: query.rate,
            provinceId: query.province,
        };

        return this.productservice.findAll(query.page, query.limit, filters);
    }


    @Get(':id')
    @Roles(roles.Admin)
    @ApiResponse({ status: 200, type: ProductDTO })
    getProductById(@Param('id', new ParseUUIDPipe()) id: string): Promise<ProductEntity> {
        return this.productservice.findOneById(id);
    }


    @ApiCreatedResponse({ description: 'El producto ha sido actualizado exitosamente' })
    @ApiForbiddenResponse({ description: 'Prohibido' })
    @ApiConsumes('multipart/form-data')
    @Patch(':id')
    @Roles(roles.Admin)
    @UseInterceptors(FileInterceptor('image', {
        storage: memoryStorage(),
    }),  WebpInterceptor)
    async update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateProductDTO: UpdateProductDTO,
        @UploadedFile() file?: Express.Multer.File
    ) {
        updateProductDTO.image = file ? file.filename : undefined;
        return this.productservice.updateByDTO(id, updateProductDTO)
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteProduct(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.productservice.softDelete(id);
    }
}
