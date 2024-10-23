import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    )
    { }

    public async getProducts(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return await this.productRepository.find({
            skip: offset,
            take: limit
        });
    }

}
