import { IsNumber, IsPositive } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class SetMinPriceToBuyDTO {
    @ApiProperty({
        type: Number,
        required: true,
        description: "Minimum price number",
    })
    @Transform(({ value }) => Number(value))
    @IsPositive()
    @IsNumber()
    price: number;
}