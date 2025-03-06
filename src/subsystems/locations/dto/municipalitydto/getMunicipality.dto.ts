import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../../common/dto/base.dto";

export class GetMunicipalityDTO extends BaseDto {
    @ApiProperty({ example: "Guanabacoa", description: "Name of the municipality" })
    name: string;

    @ApiProperty({ example: "8bebf95d-8667-4291-9265-8074db4ebe99", description: "Identifier of province" })
    province: string;

    @ApiProperty({ example: 30, description: "Base Price of the municipality" })
    basePrice: number;

    @ApiProperty({ example: 24, description: "Min of hours to receive delivery" })
    minHours: number;

    @ApiProperty({ example: 24, description: "Max of hours to receive delivery" })
    maxHours: number;
}