import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import { User } from 'src/subsystems/user/entities/user.entity';
import { BaseService } from 'src/common/services/base.service';
import { ProductEntity } from '../entity/product.entity';

@Injectable()
export class ProductService extends BaseService<ProductEntity> {

    protected getRepositoryName(): string {
        return "tb_products"
    }
    s
    constructor(
      
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    )
    {
        super(productRepository);
    }

}
