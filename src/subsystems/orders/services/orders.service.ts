import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { OrderEntity } from "../entities/order.entity";
import { BaseService } from "../../../common/services/base.service";
import { UserService } from "../../user/service/user.service";
import { ProductEntity } from "../../products/entity/product.entity";
import { BuildOrderDTO, ProductOrderDTO } from "../../public/dto/frontsDTO/ordersDTO/buildorder.dto";
import { OrderProductEntity } from "../entities/order_products.entity";
import { OrderStatus } from "../enums/orderStatus.enum";
import { captureNotFoundException } from "../../../common/exceptions/modular.exception";
import { calculateDiscount } from "../../../common/utils/global-functions.utils";
import { MunicipalityEntity } from "../../locations/entity/municipality.entity";
import { MailsService } from "src/subsystems/mails/services/mails.service";
import { MunicipalityService } from "../../locations/service/municipality.service";
import { roles } from "../../roles/enum/roles.enum";

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
    protected getRepositoryName(): string {
        return "tb_orders";
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
        @Inject(MailsService)
        private mailService: MailsService,
        @Inject(MunicipalityService)
        private readonly municipalityService: MunicipalityService,
    ) {
        super(orderRepository);
    }

    async getallORderProc(): Promise<OrderEntity[]> {
        return await this.orderRepository.find({
            relations: ["orderItems", "orderItems.product"]
        });
    }

    async getHistory(userid: string): Promise<OrderEntity[]> {
        return await this.orderRepository.find({
            where: {
                user: { id: userid }
            },
            relations: ["user"]
        });
    }

    async createOrderService(userid: string, data: BuildOrderDTO): Promise<OrderEntity> {
        //PASOS
        //Capturar USER (Validacion)
        const [user, foundProducts, municipality] = await Promise.all([
            this.userService.findUserById(userid),
            this.validateProducts(data.products),
            this.municipalityService.getMunicipality(data.municipality),
        ]);

        captureNotFoundException([user, foundProducts, municipality], ["User", "Products", "Municipality"]);

        // Mapeo para construir un array con los productos encontrados y sus quantitys

        const productsWithQuantities = data.products.map((productOrder) => {
            const product = foundProducts.find(
                (p) => p.id === productOrder.product_id
            );
            return { product, quantity: productOrder.quantity };
        });

        // Calcular subtotal
        const subtotal: number = productsWithQuantities.reduce(
            (total, { product, quantity }) => {
                return total + calculateDiscount(product, quantity);
            },
            0
        );

        if (subtotal < parseInt(process.env.MIN_PRICE)) {
            throw new BadRequestException(`You should buy a subtotal of ${process.env.MIN_PRICE}`);
        }

        // Calcular el peso total de los productos
        const totalWeight: number = productsWithQuantities.reduce(
            (total, { product, quantity }) => {
                return total + (product.weight || 0) * quantity;
            },
            0
        );

        // Encontrar el precio de envío basado en el peso total
        let shippingPrice = municipality.prices.find(
            price => totalWeight >= price.minWeight
        );

        // Si no se encuentra un precio específico para el peso, usar el precio base del municipio
        const shippingCost = shippingPrice ? shippingPrice.price : municipality.basePrice;

        //Crear Orden
        const order: OrderEntity = this.orderRepository.create({
            phone: data.phone,
            aux_phone: data .aux_phone,
            address: data.address,
            receiver_name: data.receiver_name,
            CI: data.ci,
            subtotal: subtotal,
            shipping_price: shippingCost,
            user: user,
            municipality: municipality
        });
        
        await this.orderRepository.save(order)

        //Crear Order_Products
        const orderProducts = productsWithQuantities.map(
            ({ product, quantity }) => {
                return this.orderProductRepository.create({
                    order: order,
                    product: product,
                    quantity: quantity,
        
                });
            }
        );

        await this.orderProductRepository.save(orderProducts)
        await this.mailService.sendOrderConfirmationEmail(order);

        return order;
    }

    private async validateProducts(
        products: ProductOrderDTO[]
    ): Promise<ProductEntity[]> | null {
        const ids: string[] = products.map((elemnt) => elemnt.product_id);
        const foundProducts: ProductEntity[] =
            await this.productRepository.find({
                where: { id: In(ids) },
                relations: ["discounts"]
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
            relations: {
                municipality: {
                    province: true
                },
                orderItems: {
                    product: true
                },
                user: true
            }
        });

        captureNotFoundException(order, "Order");

        if (order.status !== OrderStatus.Pending) {
            throw new BadRequestException("Status order is not pending");
        }

        const productOrderRelation: OrderProductEntity[] =
            await this.orderProductRepository.find({
                where: { order: { id: orderid } },
                relations: ["product"]
            });

        // Go through all the products related to the order to verify if there is still enough stock
        const productsToUpdate: ProductEntity[] = [];

        for (const relation of productOrderRelation) {
            if (relation.quantity > relation.product.quantity) {
                throw new BadRequestException("There is not enough stock");
            }

            relation.product.quantity -= relation.quantity;
            productsToUpdate.push(relation.product);
        }

        // Guardar todos los productos de una sola vez
        await this.productRepository.save(productsToUpdate);

        // Change order status upon completion
        order.status = OrderStatus.Paid;
        //JAVIERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR AQUI ES LO DE EL MAILLLLLLLLLLLLLLLLLLLLLL
        const response = await this.mailService.sendOrderConfirmationEmail(order)
        console.log(response);
        return await this.orderRepository.save(order);
    }

    // *--- For Public Services ---* //
    public async getOrderByUser(userId: string) {
        const orders: OrderEntity[] = await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ["orderItems", "orderItems.product"]
        });

        captureNotFoundException(orders, "Orders");
        // TODO Build a MAPPER

        return orders;
    }

    public async retireOrderByUser(userId: string, orderId: string) {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { user: { id: userId }, id: orderId }
        });

        captureNotFoundException(order, "Order");

        order.status = OrderStatus.Retired;
        order.deleted_at = new Date();

        await this.orderRepository.save(order);

        return true;
    }

    public async findOrdersByCi(ci: string) {
        return await this.orderRepository.find({
            // TODO ADD SELECT OPTIONS!
            relations: {
              orderItems: {
                  product: true,
              }
            },
            select: {
                id: true,
                receiver_name: true,
                address: true,
                CI: true,
                orderItems: {
                    quantity: true,
                    product: {
                        id: true,
                        name: true,
                    }
                }
            },
            where: {
                CI: ci,
                status: OrderStatus.Paid
            }
        });
    }

    public async completeOrder(orderId: string, deliveringId: string) {
        const [order, delivering] = await Promise.all([
            this.orderRepository.findOne({
                relations: {
                    user: true,
                    orderItems: true,
                },
                where: { id: orderId }
            }),
            this.userService.findOneById(deliveringId),
        ]);

        captureNotFoundException([order, delivering], ["Order", "Delivering"]);

        if (delivering.rol === roles.User) {
            throw new BadRequestException('You are not administrator or delivery to do this')
        }

        if (order.status !== OrderStatus.Paid) {
            throw new BadRequestException("The order has not yet been paid");
        }

        order.status = OrderStatus.Completed;
        order.delivering = delivering;
        order.updated_at = new Date();

        await this.orderRepository.save(order);
        //await this.mailService.sendOrderCompletedEmail(order);

        return { message: "La orden ha sido completada satisfactoriamente." };
    }
}

