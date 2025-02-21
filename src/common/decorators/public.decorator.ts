import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProductPublicQuery = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const query = request.query;

        return {
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 10,
            categoryIds: query.category
                ? query.category.split(',').map(Number)
                : undefined,
            subCategoryIds: query.subcategory
                ? query.subcategory.split(',').map(Number)
                : undefined,
            prices: query.pricerange
                ? query.pricerange.split('-').map(Number)
                : undefined,
            rate: query.rate ? Number(query.rate) : undefined,
        };
    },
);
