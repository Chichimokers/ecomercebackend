import { BaseEntity } from 'src/common/entities/base.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import {
    Entity,
    OneToMany,
    Column,
    OneToOne, JoinColumn
} from "typeorm";
import { ProductClass } from '../enums/products.class.enum';
import { DiscountEntity} from "../../discounts/entity/discounts.entity";
//import { RatingEntity } from "../../rating/entity/rating.entity";
import { OfferEntity } from "../../discounts/entity/offers.entity";

@Entity({ name:"tb_products"})
export class ProductEntity extends BaseEntity {
    @Column({nullable: true})
    image: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    short_description: string;

    @Column()
    class: ProductClass;

    @Column()
    quantity: number;

    @OneToMany(() => CartEntity, (cart) => cart.item)
    cart: CartEntity[];

    @OneToOne(() => OfferEntity, (offer) => offer.products,
        {nullable: true})
    @JoinColumn()
    offers: OfferEntity;

    @OneToOne(() => DiscountEntity, (offer) => offer.products,
        { nullable: true })
    @JoinColumn()
    discounts: DiscountEntity;

    /*@OneToMany(() => RatingEntity, (rating) => rating.product)
    ratings: RatingEntity[];*/
}
