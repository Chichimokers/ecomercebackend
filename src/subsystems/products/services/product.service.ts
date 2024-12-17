import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { ProductEntity } from '../entity/product.entity';

@Injectable()
export class ProductService extends BaseService<ProductEntity> {

    protected getRepositoryName(): string {
        return "tb_products"
    }   
    constructor(
      
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    )
    {
        super(productRepository);
    }

    //          *--- Services for public's Endpoints ---*
    //      *--- Get Products Pagination ---*
    public async getProducts(page: number, limit: number){
        const offset: number = (page - 1) * limit;

        const query = this.productRepository.createQueryBuilder('product')
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

        let rawItems = await query.getRawMany();
        const totalProducts: number = await query.getCount();

        rawItems = rawItems.slice(offset, offset + limit);

        const products = rawItems.map(item => ({
            id: item.product_id,
            image: item.product_image || undefined,
            name: item.product_name,
            price: item.product_price,
            description: item.product_description,
            short_description: item.product_short_description,
            quantity: item.product_quantity,
            averageRating: parseFloat(item.averageRating) || undefined,
            category: item.category_name || undefined,
            subCategory: item.subCategory_name || undefined,
            discount: (item.discount_min === null && item.discount_reduction === null)
                ? undefined
                : {
                    min: item.discount_min,
                    reduction: item.discount_reduction
                },
        }));

        const totalPages: number = Math.ceil(totalProducts / limit);

        const previousUrl: string = page - 1 <= 0 ? undefined : `/public/products?page=${page - 1}`;
        const nextUrl: string = page + 1 > totalPages ? undefined : `/public/products?page=${page + 1}`;

        return {
            products,
            previousUrl,
            nextUrl
        };
    }

}
