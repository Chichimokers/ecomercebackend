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

}
