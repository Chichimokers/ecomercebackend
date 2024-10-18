import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';

@Entity({ name: 'tb_user' })
export class User extends BaseEntity {


    @Column({ type: 'varchar', length: 30 })
    name: string;

    @Column({ type: 'varchar', length: 40 })
    email: string;
    
    @Column()
    rol: number;
    
    @Column({ type: 'varchar', nullable: false, select: false })
    password: string;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;

    @Column({ name: 'last_login', type: 'timestamp', nullable: true })
    last_login: Date | null;

    @Column({ type: 'boolean', default: false })
    locked: boolean;

    @OneToMany(() => CartEntity, (cart) => cart.id)
    @JoinColumn()
    cart: CartEntity[];
  
    
}

