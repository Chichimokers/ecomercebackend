import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import { User } from 'src/subsystems/user/entities/user.entity';
import { BaseService } from 'src/common/services/base.service';
import { UserService } from 'src/subsystems/user/service/user.service';

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
        @Inject(UserService)
        private userService : UserService
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
async createOrder(userId: number, phone: string, address: string, CI: string): Promise<OrderEntity> {
        // Obtener los productos del carrito que no han sido pagados
        const carts = await this.cartRepository.find({

            where: {
                user: { id: userId },
                paid: false,
            },

        });


        const user = await this.userService.findOneById(userId);

        if (!user) {
            throw new Error('user no encontrado');
        }
        
        const newOrder = await this.orderRepository.create({

            user: user, // Asignar el usuario
            phone,
            address, // Asegúrate de que 'address' esté definido en OrderEntity
            CI, // Asegúrate de que 'CI' esté definido en OrderEntity
            subTotal: this.calculateSubTotal(carts), // Calcular el subtotal
            pending: true, // Marcar como pendiente
            carts, // Asignar los productos del carrito

        });

        // Guardar la nueva orden en la base de datos
       const savedOrder = await this.orderRepository.save(newOrder);

       

        // Actualizar los carts relacionados
        await Promise.all(carts.map(async (cart) => {
            cart.order = savedOrder; // Asignar el ID de la orden al carrito
            cart.paid = true; // Marcar como ordenado
            return this.cartRepository.save(cart); // Guardar los cambios en el carrito
        }));
    
        return savedOrder;
    }

    private calculateSubTotal(carts: CartEntity[]): number {
        let totalprice = 0;

        carts.forEach((item)=>{
            totalprice += item.total;
        })

        return totalprice;
    }
}
