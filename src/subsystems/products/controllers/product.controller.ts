import {
    UseGuards,
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiConsumes
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductEntity } from '../entity/product.entity';
import { createProductDTO } from '../dto/createProductDTO.dto';
import { updateProductDTO } from '../dto/updateProductDTO.dto';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
            destination: './images',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    }))

    create(@Body() createProductDTO: createProductDTO, @UploadedFile() file?: Express.Multer.File) {
        let imagePaths = file ? file.filename : undefined; // Asigna el nombre del archivo si existe

        return this.productservice.create({
            ...createProductDTO,
            image: imagePaths // Solo se incluye si imagePaths no es undefined
        });
    }

    //@UseGuards(JwtAuthGuard)
    @Get()
    @Roles(roles.Admin)
    public getProducts(): Promise<ProductEntity[]> {
        return this.productservice.findAll();
    }

    @Get(':id')
    @Roles(roles.Admin)
    getProductById(@Param('id') id: string) {
        return this.productservice.findOneById(+id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateProduct(@Param('id') id: string, @Body() updateUserDto: updateProductDTO) {
        return this.productservice.update(+id, updateUserDto);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteProduct(@Param('id') id: string) {
        return this.productservice.softDelete(+id);
    }
}
