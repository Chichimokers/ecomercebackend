import { BaseEntity } from "../../../common/entities/base.entity";
import {
    Entity,
    OneToMany,
    Column,
    OneToOne, JoinColumn, Check, ManyToOne, Index
} from "typeorm";
import { DiscountEntity } from "../../discounts/entity/discounts.entity";
import { RatingEntity } from "../../rating/entity/rating.entity";
import { IsPositive, IsString } from "class-validator";
import { OrderProductEntity } from "../../orders/entities/order_products.entity";
import { CategoryEntity, SubCategoryEntity } from "../../category/entity/category.entity";
import { ProvinceEntity } from "../../locations/entity/province.entity";

@Entity({ name: "tb_products" })
@Check(`"price" > 0`)
@Check(`"quantity" >= 0`)
export class ProductEntity extends BaseEntity {
    @Column({ nullable: true })
    image: string;

    @Column()
    @IsString()
    name: string;

    @Column({ type: "numeric", precision: 10, scale: 2 })
    @IsPositive()
    price: number;

    @Column()
    @IsString()
    description: string;

    @Column({ length: 255 })
    @IsString()
    short_description: string;

    @Column()
    @IsPositive()
    quantity: number;

    @Column()
    @IsPositive()
    weight: number;

    @ManyToOne(() => ProvinceEntity, { nullable: false })
    @JoinColumn({ name: "province_id" })
    province: ProvinceEntity;

    @OneToMany(() => OrderProductEntity, (orderItem) => orderItem.product)
    orderItems: OrderProductEntity[];

    /*@OneToOne(() => OfferEntity, (offer) => offer.products,
        {nullable: true})
    @JoinColumn()
    offers: OfferEntity;*/

    @OneToOne(() => DiscountEntity, (discount) => discount.products,
        { nullable: true })
    @JoinColumn()
    discounts: DiscountEntity;

    @OneToMany(() => RatingEntity, (rating) => rating.product,{nullable:true})
    ratings: RatingEntity[];

    @ManyToOne(
        () => CategoryEntity, (category) => category.products,
        { nullable: true }
    )
    @Index()
    category: CategoryEntity;

    @ManyToOne(
        () => SubCategoryEntity, (subCategory) => subCategory.products,
        { nullable: true }
    )
    @Index()
    subCategory: SubCategoryEntity;
}
