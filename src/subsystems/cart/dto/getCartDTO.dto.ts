import { ApiProperty } from "@nestjs/swagger";


export class GetCartDTO {
    @ApiProperty({
        example: 1,
        description: "Cart id"
    })
    id: number

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
        example: 300,
        description: "Calculation of total to pay for the cart",
    })
    total: number

    @ApiProperty({
        example: 10,
        description: "Quantity of objects in the cart",
    })
    quantity: number

    @ApiProperty({
        example: true,
        description: "Pending to explanation of mr.ernest",
    })
    paid: boolean

    @ApiProperty({
        example: 1,
        description: "Relation with order",
    })
    orderId: number | null

    @ApiProperty({
        example: 1,
        description: "Relation with product id",
    })
    itemId: number

    @ApiProperty({
        example: 1,
        description: "Relation with user id (owner)"
    })
    userId: number
}