import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { BaseService } from 'src/common/services/base.service';
import { UserService } from 'src/subsystems/user/service/user.service';
import { ProductEntity } from "../../products/entity/product.entity";
import { BuildOrderDTO } from "../../public/dto/frontsDTO/ordersDTO/buildorder.dto";

@Injectable()
export class OrderService extends BaseService<OrderEntity> {

    protected getRepositoryName(): string {
        return "tb_orders"
    }
    
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @Inject(UserService)
        private userService : UserService
    ) {
        super(orderRepository);
    }


    async getHistory(userId: number) :Promise<OrderEntity[]> {
    console.log(userId)
    return await this.orderRepository.find({

        where: {

           user:{ id: userId },
      
        },
        relations: ['user']
    });

  
}
    // TODO FIXME Cambiar Metodo de creacion de orden
    async createOrder(userId: number, data: BuildOrderDTO) {
        //PASOS
        //Capturar USER (Validacion)
        //Capturar Productos (Validacion)
        //Crear Orden
        //Crear Order_Products
    }

    async processOrders(orderid: number): Promise<void> {
        // Verificar si la Orden existe
        const order: OrderEntity = await this.orderRepository.findOne(
            { where: { id: orderid } }
        );

        if (!order) {
            throw new Error('Order not found');
        }

        // Encontrar todos los productos relacionados con la orden
        /*let carts: CartEntity[] = await this.cartRepository.find({
            where: { order: { id: orderid } },
            relations: ['item'],
        });*/

        /*for (const cart of carts) {

            await this.cartRepository.save(cart)

            const productOnStock: ProductEntity =
                await this.productRepository.findOne(
                    { where: { id: cart.item.id }}
                );

            if(productOnStock.quantity < cart.quantity) {
                throw new Error('There is not enough stock');
            }

            productOnStock.quantity -= cart.quantity;

            await this.productRepository.save(productOnStock);

        }*/

        order.pending = false;
        await this.orderRepository.save(order);
    }
}
