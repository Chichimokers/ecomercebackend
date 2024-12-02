import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OfferEntity } from "../entity/offers.entity";
import { Repository } from "typeorm";
import { setOfferToProductDTO } from "../dto/offersdto/setOfferToProduct.dto";
import { ProductService } from "../../products/services/product.service";
import { ProductEntity } from "../../products/entity/product.entity";

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(OfferEntity)
        private readonly offerRepository: Repository<OfferEntity>,
        private readonly productService: ProductService,
    ) {
    }

    public async setOfferToProduct(offerData: setOfferToProductDTO){
        const product: ProductEntity = await this.productService.findOneById(offerData.product);
        if (!product) {
            throw new NotFoundException(`Product with ID ${offerData.product} not found`);
        }

        // Crear la oferta
        const offer = this.offerRepository.create({
            description: offerData.description,
            percentage: offerData.percentage,
            expire_at: offerData.expire_at,
        });

        product.offers = offer

        await this.productService.update(product.id, product);

        // Guardar la oferta en la base de datos
        return this.offerRepository.save(offer);
    }

}