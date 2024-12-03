import { Check, Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { ProductEntity } from "../../products/entity/product.entity";
import { IsNumber, IsPositive } from "class-validator";

@Entity({ name: "tb_discounts" })
@Check(`"min" > 0`)
@Check(`"reduction" > 0`)
export class DiscountEntity extends BaseEntity {
    /**
     * Minimum to validate that the purchase is discounted.
     */
    @Column()
    @IsNumber()
    @IsPositive()
    min: number;

    /**
     * Price reduction per unit, once the discount is applied
     */
    @Column()
    @IsNumber()
    @IsPositive()
    reduction: number;

    @OneToOne((): typeof ProductEntity => ProductEntity, (product: ProductEntity): DiscountEntity => product.discounts)
    products: ProductEntity;
}