import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { BaseService } from '../../../common/services/base.service';
import { UserService } from '../../user/service/user.service';
import { ProductEntity } from '../../products/entity/product.entity';
import {
    BuildOrderDTO,
    ProductOrderDTO,
} from '../../public/dto/frontsDTO/ordersDTO/buildorder.dto';
import { User } from '../../user/entities/user.entity';
import { OrderProductEntity } from '../entities/order_products.entity';
import { OrderStatus } from '../enums/orderStatus.enum';
import { notFoundException } from '../../../common/exceptions/modular.exception';
import { calculateDiscount } from "../../../common/utils/global-functions.utils";
import { MunicipalityEntity } from "../../locations/entity/municipality.entity";
import { MailerService } from '@nestjs-modules/mailer';
import { MailsService } from 'src/subsystems/mails/services/mails.service';

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
        @InjectRepository(MunicipalityEntity)
        private readonly municipalityRepository: Repository<MunicipalityEntity>,
        @Inject(UserService)
        private userService: UserService,
        @Inject(MailerService)
        private mailService :MailsService
    ) {
        super(orderRepository);
    }
    async getallORderProc() {
        return await this.orderRepository.find({
            relations: ['orderItems', 'orderItems.product'],
        });
    }

    async getHistory(userid: string): Promise<OrderEntity[]> {
        console.log(userid);
        return await this.orderRepository.find({
            where: {
                user: { id: userid },
            },
            relations: ['user'],
        });
    }

    async createOrderService(userid: string, data: BuildOrderDTO) {
        //PASOS
        //Capturar USER (Validacion)
        const user: User = await this.userService.findOneById(userid);

        notFoundException(user, 'User');

        const foundProducts: ProductEntity[] = await this.validateProducts(
            data.products,
        );

        notFoundException(foundProducts, 'Products');

        const municipality: MunicipalityEntity = await this.municipalityRepository.findOneBy(
            { id: data.municipality }
        );

        notFoundException(municipality, 'Municipality');

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
            municipality: municipality,
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
        const ids: string[] = products.map((elemnt) => elemnt.product_id);
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

    async processOrders(orderid: string): Promise<OrderEntity> {
        // Verificar si la Orden existe
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderid },
        });

        notFoundException(order, 'Order');

        if (order.status !== OrderStatus.Accepted) {
            throw new BadRequestException('Status order is not pending');
        }

        const productOrderRelation: OrderProductEntity[] =
            await this.orderProductRepository.find({
                where: { order: { id: orderid } },
                relations: ['product'],
            });

        // Go through all the products related to the order to verify if there is still enough stock
        for (const relation of productOrderRelation) {
            if (relation.quantity > relation.product.quantity) {
                throw new BadRequestException('There is not enough stock');
            }

            relation.product.quantity -= relation.quantity;

            await this.productRepository.save(relation.product);
        }

        // Change order status upon completion
        order.status = OrderStatus.Paid;
        
        await this.mailService.sendOrderConfirmationEmail(order)

        return await this.orderRepository.save(order);
    }

    // *--- For Public Services ---* //
    public async getOrderByUser(userId: string) {
        const orders: OrderEntity[] = await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['orderItems', 'orderItems.product'],
        });

        notFoundException(orders, 'Orders');
        // TODO Build a MAPPER

        return orders;
    }

    public async retireOrderByUser(userId: string, orderId: string) {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { user: { id: userId }, id: orderId },
        });

        notFoundException(order, 'Order');

        order.status = OrderStatus.Retired;
        order.deleted_at = new Date();

        await this.orderRepository.save(order);

        return true;
    }
}

