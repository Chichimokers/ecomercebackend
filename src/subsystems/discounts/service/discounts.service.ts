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
        private readonly productService: ProductService,
    ) {
    }

    public async setDiscountToProduct(discountData: setDiscountToProductDTO) {
        const product: ProductEntity = await this.productService.findOneById(discountData.product);
        if (!product) {
            throw new NotFoundException(`Product with ID ${discountData.product} not found`);
        }

        const discount = this.discountRepository.create({
           min: discountData.min,
           reduction: discountData.reduction,
        });

        product.discounts = discount;

        await this.productService.update(product.id, product);

        return this.discountRepository.save(discount);
    }
}