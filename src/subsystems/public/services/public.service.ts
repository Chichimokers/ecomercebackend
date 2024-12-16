import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../products/entity/product.entity";
import { Repository } from "typeorm";
import { CategoryEntity, SubCategoryEntity } from "../../category/entity/category.entity";

@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(SubCategoryEntity)
        private readonly subCategoryRepository: Repository<SubCategoryEntity>,
    ) {
    }

    public async getProductsPage(page: number, limit: number){
        const [productsData, categories] = await Promise.all([
            this.getProducts(page, limit),
            this.getCategoriesWithSubCategories()
        ]);

        return {
            products: productsData.products,
            previousUrl: productsData.previousUrl,
            nextUrl: productsData.nextUrl,
            categories,
        };
    }

    // Modular get products function to public services.
    private async getProducts(page: number, limit: number){
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

    // TODO Missing filter of categories without products
    private async getCategoriesWithSubCategories() {
        const categories = await this.categoryRepository.find({
            relations: ['subCategories', 'subCategories.products', 'products']
        });

        return categories
            .filter(category => category.products.length > 0 || category.subCategories.some(subCategory => subCategory.products.length > 0))
            .map(category => ({
                id: category.id,
                name: category.name,
                subCategories: category.subCategories
                    .filter(subCategory => subCategory.products.length > 0)
                    .map(subCategory => ({
                        id: subCategory.id,
                        name: subCategory.name
                    }))
            }));
    }


}