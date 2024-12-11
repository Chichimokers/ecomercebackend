import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../products/entity/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) {
    }

    public async getProductsPage(page: number, limit: number){
        const products = this.getProducts(page, limit);

        return products;
    }

    // Modular get products function to public services.
    private async getProducts(page: number, limit: number) {
        const offset: number = (page - 1) * limit;

        const query = this.productRepository.createQueryBuilder('product')
            .leftJoin('product.ratings', 'rating')
            .leftJoin('product.discounts', 'discount')
            .addSelect('AVG(rating.rate)', 'averageRating')
            .addSelect(['discount.min', 'discount.reduction'])
            .skip(offset)
            .take(limit)
            .groupBy('product.id')
            .addGroupBy('discount.id');

        let rawItems = await query.getRawMany();
        const totalProducts: number = await query.getCount();

        rawItems = rawItems.slice(offset, offset + limit);

        const items = rawItems.map(item => ({
            id: item.product_id,
            image: item.product_image,
            name: item.product_name,
            price: item.product_price,
            description: item.product_description,
            short_description: item.product_short_description,
            class: item.product_class,
            quantity: item.product_quantity,
            averageRating: parseFloat(item.averageRating),
            discount: (item.discount_min === null && item.discount_reduction === null)
                ? undefined
                : {
                    min: item.discount_min,
                    reduction: item.discount_reduction
                }
        }));

        const totalPages: number = Math.ceil(totalProducts / limit);

        const previousUrl: string = page - 1 <= 0 ? null : `/public/products?page=${page - 1}`;
        const nextUrl: string = page + 1 > totalPages ? null : `/public/products?page=${page + 1}`;

        return {
            items,
            previousUrl,
            nextUrl
        };
    }
}