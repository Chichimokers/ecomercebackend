import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class StripeDTO {
    @ApiProperty({ example: 1, description: "ID of the order to pay" })
    @IsNotEmpty()
    @IsUUID()
    id: string
}

export class CreatedCheckoutDTO {
    @ApiProperty({ example: 1, description: "ID of the order to pay" })
    id: string

    @ApiProperty({ example: 300, description: "Total to pay" })
    amount_total: number

    @ApiProperty({ example: "usd", description: "Actual currency to pay" })
    currency: string

    @ApiProperty({ example: true, description: "Status of payment" })
    payment_status: boolean

    @ApiProperty({ example: "https://example.com/", description: "URL of checkout session of stripe" })
    url: string

    @ApiProperty({ example: "https://example.com/", description: "URL of success action" })
    success_url: string

    @ApiProperty({ example: { order_id : 1, user_id: 1 } ,description: "Metadata sent to stripe" })
    metadata: any

    @ApiProperty({ description: "Creation date" })
    created: string
}