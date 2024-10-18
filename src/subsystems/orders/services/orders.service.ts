import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import { User } from 'src/subsystems/user/entities/user.entity';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {

    protected getRepositoryName(): string {
        return "tb_orders"
    }
    
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
    ) {
        super(orderRepository);
    }


async getHistory(userId: number) :Promise<OrderEntity[]> {

    return await this.orderRepository.find({

        where: {

           user:{ id: userId}

        },

    });

  
}
async createOrder(userId: number, phone: string, address: string, CI: number): Promise<OrderEntity> {
        // Obtener los productos del carrito que no han sido pagados
        const carts = await this.cartRepository.find({

            where: {
                user: { id: userId },
                paid: false,

            },

        });
        // Crear una nueva orden
        const newOrder = await this.orderRepository.create({

            user: { id: userId }, // Asignar el usuario
            phone,
            address, // Asegúrate de que 'address' esté definido en OrderEntity
            CI, // Asegúrate de que 'CI' esté definido en OrderEntity
            subTotal: this.calculateSubTotal(carts), // Calcular el subtotal
            pending: true, // Marcar como pendiente
            carts, // Asignar los productos del carrito

        });

        // Guardar la nueva orden en la base de datos
        return await this.orderRepository.save(newOrder);
    }

    private calculateSubTotal(carts: CartEntity[]): number {
        let totalprice = 0;

        carts.forEach((item)=>{
            totalprice += item.total;
        })

        return totalprice;
    }
}
