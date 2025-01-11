import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from "../../../common/services/base.service";
import { ProductEntity } from '../entity/product.entity';
import { SelectQueryBuilder } from 'typeorm';

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
        const urls: { previousUrl: string, nextUrl: string, totalPages: number } = await this.getUrls(query, page, limit);

        return {
            products,
            urls
        };
    }

    //      *--- Get Products Home ---*
    public async getProductsHome(limit: number) {
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

        return this.mapProduct(query, true, 0, limit);
    }

    //      *--- Get Filtered Products ---*
    public async getFilteredProducts(filters: {
        categoryIds?: number[];
        subCategoryIds?: number[];
        prices?: number[];
        rate?: number;
    }, page: number, limit: number) {
        const query = this.getBaseQuery();

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

        if (filters.prices && filters.prices.length > 0) {
            query.andWhere('product.price BETWEEN :min AND :max', {
                min: filters.prices[0],
                max: filters.prices[1],
            });
        }

        if (filters.rate) {
            query.andHaving('AVG(rating.rate) >= :rate', {
                rate: filters.rate,
            });
        }

        const offset: number = (page - 1) * limit;

        const urls: { previousUrl: string, nextUrl: string, totalPages: number } = await this.getUrls(query, page, limit);

        return {
            products: await this.mapProduct(query, true, offset, limit),
            urls
        };
    }

    //      *--- Search Product by Name ---*
    public async searchProductByName(name: string) {
        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoin('product.ratings', 'rating')
            .leftJoin('product.discounts', 'discount')
            .leftJoin('product.category', 'category')
            .leftJoin('product.subCategory', 'subCategory')
            .addSelect('AVG(rating.rate)', 'averageRating')
            .addSelect(['discount.min', 'discount.reduction'])
            .addSelect(['category.name', 'subCategory.name'])
            .where('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` })
            .groupBy('product.id')
            .addGroupBy('discount.id')
            .addGroupBy('category.id')
            .addGroupBy('subCategory.id');

        return this.mapProduct(query);
    }

    //      *--- Get Product Detail ---*
    public async getProductDetails(id: number) {
        const query = this.getBaseQuery();
        query.where('product.id=(:id)', { id: id })
        const product: any = await this.mapProduct(query);

        if(!product[0]) throw new NotFoundException('Not found the product');

        return product[0];
    }

    public async getRelations(id: number){
        const product: ProductEntity = await this.productRepository.findOne(
            {
                where: { id },
                relations: ['category', 'subCategory'],
            }
        );

        if(!product) throw new NotFoundException('Not found the product')

        const category = product.category;
        const subcategory = product.subCategory;

        if(!category && !subcategory){
            throw new NotFoundException('Not found relations');
        }

        const query = this.getBaseQuery();

        query.where('product.id != :id', { id });

        if (category) {
            query.andWhere('category.id = :categoryId', { categoryId: category.id });
        }

        if (subcategory) {
            query.orWhere('subCategory.id = :subCategoryId', { subCategoryId: subcategory.id });
        }

        return this.mapProduct(query, true, 0, 15);
    }



    private async getUrls(query: SelectQueryBuilder<ProductEntity>, page: number, limit: number){
        const totalProducts = await query.getCount();
        const totalPages = Math.ceil(totalProducts / limit);

        const previousUrl: string =
            page - 1 <= 0 ? undefined : `/public/products?page=${page - 1}`;
        const nextUrl: string =
            page + 1 > totalPages
                ? undefined
                : `/public/products?page=${page + 1}`;

        return { previousUrl, nextUrl, totalPages }
    }

    private getBaseQuery() {
        return this.productRepository
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
            .addGroupBy('subCategory.id')
    }
}
