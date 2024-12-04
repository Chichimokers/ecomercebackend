import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, In, Repository } from "typeorm";
import { OrderEntity } from "../entities/order.entity";
import { BaseService } from "src/common/services/base.service";
import { UserService } from "src/subsystems/user/service/user.service";
import { ProductEntity } from "../../products/entity/product.entity";
import { BuildOrderDTO, ProductOrderDTO } from "../../public/dto/frontsDTO/ordersDTO/buildorder.dto";
import { User } from "../../user/entities/user.entity";
import { calculateDiscount } from "../../../common/utils/global-functions.utils";
import { OrderProductEntity } from "../entities/order_products.entity";

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
        @InjectRepository(OrderProductEntity)
        private readonly orderProductRepository: Repository<OrderProductEntity>,
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
    async createOrderService(userId: number, data: BuildOrderDTO) {
        //PASOS
        //Capturar USER (Validacion)
        const user: User = await this.userService.findOneById(userId);

        if(!user){
            throw Error('User not found');
        }

        const foundProducts: ProductEntity[] = await this.validateProducts(data.products);

        if(foundProducts === null){
            throw Error('Products are not valid');
        }

        // Mapeo para construir un array con los productos encontrados y sus quantitys
        const productsWithQuantities = data.products.map(productOrder => {
            const product = foundProducts.find(p => p.id === productOrder.product_id);
            return { product, quantity: productOrder.quantity };
        });

        // Calcular subtotal
        const subtotal: number = productsWithQuantities.reduce((total, { product, quantity }) => {
            return total + calculateDiscount(product, quantity);
        }, 0);

        //Crear Orden
        const order = this.orderRepository.create({
            receiver_name: data.receiver_name,
            phone: data.phone,
            province: data.province,
            address: data.address,
            CI: data.ci,
            subtotal: subtotal,
            user: user,
            pending: true,
        });

        await this.orderRepository.save(order);
        //Crear Order_Products
        const orderProducts = productsWithQuantities.map(({ product, quantity }) => {
            return this.orderProductRepository.create({
                order: order,
                product: product,
                quantity: quantity,
            });
        });

        await this.orderRepository.save(orderProducts);
    }

    private async validateProducts(products: ProductOrderDTO[]): Promise<ProductEntity[]> | null {

        let ids : number[] = await products.map(elemnt=> elemnt.product_id);
        const foundProducts: ProductEntity[] = await this.productRepository.findBy({ id: In(products) })

        if(ids.length === foundProducts.length){
            return foundProducts;
        }

        return null;
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
