import { Column, Entity, ManyToOne, Unique, Check } from "typeorm";
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ProductEntity } from '../../products/entity/product.entity';

@Entity({ name: 'tb_rating' })
@Unique(['user', 'product'])
@Check(`"rate" >= 0 AND "rate" <= 5`)
export class RatingEntity extends BaseEntity {
    @Column()
    rate: number;

    @ManyToOne(() => User, (user) => user.ratings)
    user: User;

    @ManyToOne(() => ProductEntity, (product) => product.ratings)
    product: ProductEntity;
}
