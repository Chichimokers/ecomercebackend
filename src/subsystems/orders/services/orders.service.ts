import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { BaseService } from 'src/common/services/base.service';
import { UserService } from 'src/subsystems/user/service/user.service';
import { ProductEntity } from '../../products/entity/product.entity';
import {
    BuildOrderDTO,
    ProductOrderDTO,
} from '../../public/dto/frontsDTO/ordersDTO/buildorder.dto';
import { User } from '../../user/entities/user.entity';
import { calculateDiscount } from '../../../common/utils/global-functions.utils';
import { OrderProductEntity } from '../entities/order_products.entity';
import { OrderStatus } from '../enums/orderStatus.enum';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
    protected getRepositoryName(): string {
        return 'tb_orders';
    }

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(OrderProductEntity)
        private readonly orderProductRepository: Repository<OrderProductEntity>,
        @Inject(UserService)
        private userService: UserService,
    ) {
        super(orderRepository);
    }
    async getallORderProc() {
        return await this.orderRepository.find({
            relations: ['orderItems', 'orderItems.product'],
        });
    }

    async getHistory(userId: number): Promise<OrderEntity[]> {
        console.log(userId);
        return await this.orderRepository.find({
            where: {
                user: { id: userId },
            },
            relations: ['user'],
        });
    }
    // TODO FIXME Cambiar Metodo de creacion de orden
    async createOrderService(userId: number, data: BuildOrderDTO) {
        //PASOS
        //Capturar USER (Validacion)
        const user: User = await this.userService.findOneById(userId);

        if (!user) {
            throw Error('User not found');
        }

        const foundProducts: ProductEntity[] = await this.validateProducts(
            data.products,
        );

        if (!foundProducts) {
            throw Error('Products are not valid');
        }

        // Mapeo para construir un array con los productos encontrados y sus quantitys

        const productsWithQuantities = data.products.map((productOrder) => {
            const product = foundProducts.find(
                (p) => p.id === productOrder.product_id,
            );
            return { product, quantity: productOrder.quantity };
        });

        // Calcular subtotal
        const subtotal: number = productsWithQuantities.reduce(
            (total, { product, quantity }) => {
                return total + calculateDiscount(product, quantity);
            },
            0,
        );

        //Crear Orden
        const order: OrderEntity = this.orderRepository.create({
            phone: data.phone,
            province: data.province,
            address: data.address,
            receiver_name: data.receiver_name,
            CI: data.ci,
            subtotal: subtotal,
            user: user,
        });

        await this.orderRepository.save(order);

        //Crear Order_Products
        const orderProducts = productsWithQuantities.map(
            ({ product, quantity }) => {
                return this.orderProductRepository.create({
                    order: order,
                    product: product,
                    quantity: quantity,
                });
            },
        );

        await this.orderProductRepository.save(orderProducts);

        return order;
    }

    private async validateProducts(
        products: ProductOrderDTO[],
    ): Promise<ProductEntity[]> | null {
        let ids: number[] = products.map((elemnt) => elemnt.product_id);
        const foundProducts: ProductEntity[] =
            await this.productRepository.find({
                where: { id: In(ids) },
                relations: ['discounts'],
            });

        if (ids.length === foundProducts.length) {
            return foundProducts;
        }

        return null;
    }

    async processOrders(orderid: number) :Promise<OrderEntity> {
        // Verificar si la Orden existe
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderid },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status !== OrderStatus.Accepted) {
            throw new Error('Status order is not pending');
        }

        let productOrderRelation: OrderProductEntity[] =
            await this.orderProductRepository.find({
                where: { order: { id: orderid } },
                relations: ['product'],
            });


        // Go through all the products related to the order to verify if there is still enough stock
        for (const relation of productOrderRelation) {
            if (relation.quantity > relation.product.quantity) {
                throw new Error('There is not enough stock');
            }

            relation.product.quantity -= relation.quantity;

            await this.productRepository.save(relation.product);
        }

        // Change order status upon completion
        order.status = OrderStatus.Paid;

        return await this.orderRepository.save(order);
    }
}

