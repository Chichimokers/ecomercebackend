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
        return await this.productRepository.find({
            skip: offset,
            take: limit
        });
    }


    // Find product by name
    public async getProductByName(name: string) {
        return await this.productRepository.find({
            where: {
                name: Like(`%${name}%`)
            }
        });
    }
}
