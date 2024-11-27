import { ApiProperty } from "@nestjs/swagger";

export class StripeDTO {
    @ApiProperty({ example: 1, description: "ID of the order to pay" })
    id: number
}