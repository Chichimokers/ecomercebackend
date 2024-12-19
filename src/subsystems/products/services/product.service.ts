import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { ProductEntity } from '../entity/product.entity';

@Injectable()
export class ProductService extends BaseService<ProductEntity> {
    protected getRepositoryName(): string {
        return 'tb_products';
    }
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) {
        super(productRepository);
    }

    private async mapProduct(query, slice = false, offset = 0, limit = 0) {
        let item = await query.getRawMany();

        if (slice) {
            item = item.slice(offset, offset + limit);
        }

        return item.map((item) => ({
            id: item.product_id,
            image: item.product_image || undefined,
            name: item.product_name,
            price: item.product_price,
            description: item.product_description,
            short_description: item.product_short_description,
            quantity: item.product_quantity,
            averageRating: parseFloat(item.averageRating) || undefined,
            category:
                item.category_name || item.product_categoryId || undefined,
            subCategory:
                item.subCategory_name ||
                item.product_subCategoryId ||
                undefined,
            discount:
                item.discount_min === null && item.discount_reduction === null
                    ? undefined
                    : {
                          min: item.discount_min,
                          reduction: item.discount_reduction,
                      },
        }));
    }

    //      *--- Services for public's Endpoints ---*
    //      *--- Get Products Pagination ---*
    public async getProducts(page: number, limit: number) {
        const offset: number = (page - 1) * limit;

        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoin('product.ratings', 'rating')
            .leftJoin('product.discounts', 'discount')
            .leftJoin('product.category', 'category')
            .leftJoin('product.subCategory', 'subCategory')
            .addSelect('AVG(rating.rate)', 'averageRating')
            .addSelect(['discount.min', 'discount.reduction'])
            .addSelect(['category.name', 'subCategory.name'])
            .skip(offset)
            .take(limit)
            .groupBy('product.id')
            .addGroupBy('discount.id')
            .addGroupBy('category.id')
            .addGroupBy('subCategory.id');

        const products = await this.mapProduct(query, true, offset, limit);
        const totalProducts: number = await query.getCount();
        const totalPages: number = Math.ceil(totalProducts / limit);
        const previousUrl: string =
            page - 1 <= 0 ? undefined : `/public/products?page=${page - 1}`;
        const nextUrl: string =
            page + 1 > totalPages
                ? undefined
                : `/public/products?page=${page + 1}`;

        return {
            products,
            previousUrl,
            nextUrl,
        };
    }

    //      *--- Get Products Home ---*
    public async getProductsHome() {
        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoin('product.ratings', 'rating')
            .leftJoin('product.discounts', 'discount')
            .addSelect('AVG(rating.rate)', 'averageRating')
            .addSelect(['discount.min', 'discount.reduction'])
            .groupBy('product.id')
            .addGroupBy('discount.id')
            .having('COUNT(rating.id) > 0')
            .orderBy('"averageRating"', 'DESC');

        return this.mapProduct(query);
    }

    //      *--- Get Filtered Products ---*
    public async getFilteredProducts(filters: {
        categoryIds?: number[];
        subCategoryIds?: number[];
    }) {
        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoin('product.ratings', 'rating')
            .leftJoin('product.discounts', 'discount')
            .leftJoin('product.category', 'category')
            .leftJoin('product.subCategory', 'subCategory')
            .addSelect('AVG(rating.rate)', 'averageRating')
            .addSelect(['discount.min', 'discount.reduction'])
            .addSelect(['category.name', 'subCategory.name'])
            .groupBy('product.id')
            .addGroupBy('discount.id')
            .addGroupBy('category.id')
            .addGroupBy('subCategory.id');

        if (filters.categoryIds && filters.categoryIds.length > 0) {
            query.andWhere('category.id IN (:...categoryIds)', {
                categoryIds: filters.categoryIds,
            });
        }

        if (filters.subCategoryIds && filters.subCategoryIds.length > 0) {
            query.andWhere('subCategory.id IN (:...subCategoryIds)', {
                subCategoryIds: filters.subCategoryIds,
            });
        }

        return {
            products: await this.mapProduct(query),
            previousUrl: undefined,
            nextUrl: undefined,
        };
    }
}
