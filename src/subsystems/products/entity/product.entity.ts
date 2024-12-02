import { BaseEntity } from 'src/common/entities/base.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import {
    Entity,
    OneToMany,
    Column,
    OneToOne, JoinColumn, Check
} from "typeorm";
import { ProductClass } from '../enums/products.class.enum';
import { DiscountEntity} from "../../discounts/entity/discounts.entity";
//import { RatingEntity } from "../../rating/entity/rating.entity";
import { OfferEntity } from "../../discounts/entity/offers.entity";
import { IsPositive, IsString } from "class-validator";

@Entity({ name:"tb_products"})
@Check(`"price" > 0`)
@Check(`"quantity" >= 0`)
export class ProductEntity extends BaseEntity {
    @Column({nullable: true})
    image: string;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsPositive()
    price: number;

    @Column()
    @IsString()
    description: string;

    @Column({length: 255})
    @IsString()
    short_description: string;

    @Column({type: 'smallint'})
    class: ProductClass;

    @Column()
    @IsPositive()
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
