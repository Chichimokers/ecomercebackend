import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../common/dto/base.dto";
import { CartEntity } from "../../cart/entity/cart.entity";

export class GetOrderDTO extends BaseDto {
    @ApiProperty({
        example: "2024-11-23T23:40:35.746Z",
        description: "Date when it was created",
    })
    created_at: string

    @ApiProperty({
        example: "2024-11-23T23:40:35.746Z",
        description: "Date when it was updated",
    })
    updated_at: string

    @ApiProperty({
        example: "2024-11-23T23:40:35.746Z",
        description: "Date when it was deleted",
        nullable: true,
    })
    deleted_at: string

    @ApiProperty({
        example: "56######",
        description: "Contact number related to the order",
    })
    phone: string

    @ApiProperty({
        example: "Street / Street and Street #",
        description: "Address where the purchased items will be received",
    })
    address: string

    @ApiProperty({
        example: "970422#####",
        description: "CI or ID of the person who will receive the purchased objects",
    })
    CI: string

    @ApiProperty({
        example: 340.99,
        description: "Calculated amount to pay for the order",
    })
    subtotal: number

    @ApiProperty({
        example: true,
        description: "Specify whether or not it is pending payment",
    })
    pending: boolean

    @ApiProperty({
        example: "sha256",
        description: "Stripe ID to make payment"
    })
    stripe_id: string

    @ApiProperty({
        example: "Cart Structure",
        description: "All products in cart to buy",
    })
    carts: CartEntity
}