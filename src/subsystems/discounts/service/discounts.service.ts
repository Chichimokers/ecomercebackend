import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from '../entity/discounts.entity';
import { Repository } from 'typeorm';
import { setDiscountToProductDTO } from '../dto/discountsdto/setDiscountToProduct.dto';
import { ProductEntity } from '../../products/entity/product.entity';
import { ProductService } from '../../products/services/product.service';
import { BaseService } from '../../../common/services/base.service';
import { captureNotFoundException } from '../../../common/exceptions/modular.exception';

@Injectable()
export class DiscountsService extends BaseService<DiscountEntity> {
    protected getRepositoryName(): string {
        return 'tb_category';
    }

    constructor(
        @InjectRepository(DiscountEntity)
        private readonly discountRepository: Repository<DiscountEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @Inject(ProductService) private readonly productService: ProductService,
    ) {
        super(discountRepository);
    }

    public async setDiscountToProduct(
        discountData: setDiscountToProductDTO,
    ): Promise<Partial<ProductEntity>> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: discountData.product },
            relations: ['discounts'],
        });

        captureNotFoundException(product, `Product with ID ${discountData.product}`);

        const discount: DiscountEntity = this.discountRepository.create({
            min: discountData.min,
            reduction: discountData.reduction,
        });

        product.discounts = await this.discountRepository.save(discount);

        return await this.productService.update(product.id, product);
    }
}
