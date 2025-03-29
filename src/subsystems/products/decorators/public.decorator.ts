import { createParamDecorator, ExecutionContext, applyDecorators } from "@nestjs/common";
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductsViewDTO } from '../../public/dto/frontsDTO/views/productsView.dto';

export const ProductPublicQuery = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const query = request.query;

        return {
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 30,
            province: query.province ? query.province : undefined,
            categoryIds: query.category
                ? query.category.split(',').map(String)
                : undefined,
            subCategoryIds: query.subcategory
                ? query.subcategory.split(',').map(String)
                : undefined,
            prices: query.pricerange
                ? query.pricerange.split('-').map(Number)
                : undefined,
            rate: query.rate ? Number(query.rate) : undefined,
        };
    },
);

export function ProductPublicApiDoc() {
    return applyDecorators(
        ApiQuery({ name: 'page', required: false, type: Number }),
        ApiQuery({ name: 'limit', required: false, type: Number }),
        ApiQuery({
            name: 'category',
            required: false,
            isArray: true,
            type: Number,
            description: 'Category IDs separated by commas',
        }),
        ApiQuery({
            name: 'subcategory',
            required: false,
            isArray: true,
            type: Number,
            description: 'Subcategory IDs separated by commas',
        }),
        ApiQuery({
            name: 'pricerange',
            required: false,
            isArray: true,
            type: Number,
            description: 'Price range separated by hyphen',
        }),
        ApiQuery({
            name: 'rate',
            required: false,
            type: Number,
            description: 'Rate of the product',
        }),
        ApiQuery({
           name: 'province',
           required: false,
           type: String,
           description: 'Province id',
        }),
        ApiResponse({ status: 200, type: ProductsViewDTO }),
        ApiResponse({
            status: 404,
            description: 'In case there is no product searched',
        }),
        ApiResponse({
            status: 400,
            description: 'In case you send a query without inserting valid data',
        }),
    );
}


