import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { Repository, Like } from 'typeorm';
import { OrderEntity } from "../../orders/entities/order.entity";

@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    )
    { }

    // Get products with pagination
    public async getProducts(page: number, limit: number) {
        const offset: number = (page - 1) * limit;
        const products: ProductEntity[] = await this.productRepository.find({
            skip: offset,
            take: limit
        });

        const totalProducts: number = await this.productRepository.count();
        const totalPages: number = Math.ceil(totalProducts / limit);

        const previousUrl: string = page - 1 <= 0 ? null : `/public/products?page=${page - 1}`;
        const nextUrl: string = page + 1 > totalPages ? null : `/public/products?page=${page + 1}`;

        return {
            products,
            previousUrl,
            nextUrl
        };
    }
    // Find product by name
    public async getProductByName(name: string): Promise<ProductEntity[]> {
        return await this.productRepository.find({
            where: {
                name: Like(`%${name}%`)
            }
        });
    }

    public async getProductInfo(id: number): Promise<ProductEntity>{
        return await this.productRepository.findOne({
            where: {
                id
            }
        });
    }

    public async getPublicOrders(userId: number): Promise<OrderEntity[]> {
        console.log(userId)
        return await this.orderRepository.find({

            where: {

                user:{ id: userId },

            },
            relations: ['carts','carts.item',]
        });
    }
}
