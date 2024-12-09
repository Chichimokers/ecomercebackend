import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscountEntity } from "../entity/discounts.entity";
import { Repository } from "typeorm";
import { setDiscountToProductDTO } from "../dto/discountsdto/setDiscountToProduct.dto";
import { ProductEntity } from "../../products/entity/product.entity";
import { ProductService } from "../../products/services/product.service";

@Injectable()
export class DiscountsService {
    constructor(
        @InjectRepository(DiscountEntity)
        private readonly discountRepository: Repository<DiscountEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly productService: ProductService,
    ) {
    }

    public async setDiscountToProduct(discountData: setDiscountToProductDTO): Promise<Partial<ProductEntity>> {
        const product: ProductEntity = await this.productRepository.findOne(
            {
                where: { id: discountData.product },
                relations: ['discounts'],
            }
        );

        if (!product) {
            throw new NotFoundException(`Product with ID ${discountData.product} not found`);
        }

        console.log(product);

        const discount: DiscountEntity = this.discountRepository.create({
            min: discountData.min,
            reduction: discountData.reduction
        });

        const savedDiscount: DiscountEntity = await this.discountRepository.save(discount);

        product.discounts = savedDiscount;

        return await this.productService.update(product.id, product);
    }
}