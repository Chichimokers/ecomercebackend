import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class DeleteOrderDTO {
    @ApiProperty({
        example: '38f1844f-6f9f-4656-ba50-6542f75e76be',
        description: 'UUID of order to retire',
    })
    @IsNotEmpty()
    @IsUUID()
    orderId: string;
}