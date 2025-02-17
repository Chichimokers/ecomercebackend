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
import { createProductDTO } from '../dto/createProductDTO.dto';
import { UpdateProductDTO } from '../dto/updateProductDTO.dto';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductDTO } from '../../public/dto/frontsDTO/productsDTO/getproducts.dto';
import { RefineQuery } from '../../../common/decorators/queryadmin.decorator';
import { BaseQueryInterface } from '../../../common/interfaces/basequery.interface';

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
        storage: diskStorage({
            destination: './public/images',
            filename: (req, file, cb): void => {
                const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    }))

    create(@Body() createProductDTO: createProductDTO, @UploadedFile() file?: Express.Multer.File): Promise<ProductEntity> {
        let imagePaths: string = file ? file.filename : undefined; // Asigna el nombre del archivo si existe

        return this.productservice.create({
            ...createProductDTO,
            image: imagePaths // Solo se incluye si imagePaths no es undefined
        });
    }

    //@UseGuards(JwtAuthGuard)
    
    @Get()
    @Roles(roles.Admin)
    @ApiResponse({ status: 200, type: [ProductDTO] })
    public getProducts(@RefineQuery() query: BaseQueryInterface): Promise<ProductEntity[]> {
        const { _start, _end } = query;
        return this.productservice.findAll(_start, _end);
    }

    @Get(':id')
    @Roles(roles.Admin)
    @ApiResponse({ status: 200, type: ProductDTO })
    getProductById(@Param('id', new ParseUUIDPipe()) id: string): Promise<ProductEntity> {
        return this.productservice.findOneById(id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateProduct(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateProductDto: UpdateProductDTO): Promise<ProductEntity> {
        return this.productservice.updateAll(id, updateProductDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteProduct(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.productservice.softDelete(id);
    }
}
