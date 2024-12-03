import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import { BaseService } from 'src/common/services/base.service';
import { UserService } from 'src/subsystems/user/service/user.service';
import { ProductService } from 'src/subsystems/products/services/product.service';
import { ProductEntity } from '../../products/entity/product.entity';
import { addCartDTO } from '../dto/addCartDTO.dto';
import { User } from "../../user/entities/user.entity";

@Injectable()
export class CartService extends BaseService<CartEntity> {

    protected getRepositoryName(): string {
        return "tb_cart"
    }

    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        @Inject(ProductService)
        private productService: ProductService,
        @Inject(UserService)
        private userService: UserService) {
        super(cartRepository)
    }


    calculartotal(Producto: ProductEntity, dto: addCartDTO): number {
        return Producto.price * dto.quantity;
    }

    async addToCart(cartDto: addCartDTO, userid: string): Promise<CartEntity> {
        const product: ProductEntity = await this.productService.findOneById(cartDto.productId); // Asegúrate de tener acceso al repositorio de productos

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        const user: User = await this.userService.findOneById(userid);

        if (!user) {
            throw new Error('user no encontrado');
        }

        const existingCart: CartEntity = await this.cartRepository.findOne({
            where: { user: user, item: product }
        });

        // TODO Add discount calc
        if(existingCart){
            existingCart.quantity += product.quantity;
            await this.cartRepository.update(existingCart, existingCart);
            return await this.cartRepository.save(existingCart);
        }

        const carent: CartEntity = this.cartRepository.create({
            user: user,
            item: product,
            quantity: cartDto.quantity,
            total: this.calculartotal(product, cartDto),
            paid: false,
            order: null
        });

        return await this.cartRepository.save(carent)

    }

}
