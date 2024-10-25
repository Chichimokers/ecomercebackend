import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { Repository, Like } from 'typeorm';


@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    )
    { }

    // Get products with pagination
    public async getProducts(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const products = await this.productRepository.find({
            skip: offset,
            take: limit
        });

        const totalProducts: number = await this.productRepository.count();
        const totalPages: number = Math.ceil(totalProducts / limit);

        const previousUrl = page - 1 <= 0 ? null : `/public/products?page=${page - 1}`;
        const nextUrl = page + 1 > totalPages ? null : `/public/products?page=${page + 1}`;

        return {
            products,
            previousUrl,
            nextUrl
        };
    }


    // Find product by name
    public async getProductByName(name: string) {
        return await this.productRepository.find({
            where: {
                name: Like(`%${name}%`)
            }
        });
    }

    public async getProductInfo(id: number){
        return await this.productRepository.findOne({
            where: {
                id
            }
        });
    }
}
