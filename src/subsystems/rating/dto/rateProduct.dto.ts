import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsUUID, Max, Min } from "class-validator";

export class RateProductDTO {

    @ApiProperty({
        example: "UUID",
        description: "UUID",
    })
    @IsUUID()
    @IsArray()
    products: string[];

    @ApiProperty({
        example: 5,
        description: "Rate",
    })
    @Min(0)
    @Max(5)
    @IsNumber()
    rate: number;
}