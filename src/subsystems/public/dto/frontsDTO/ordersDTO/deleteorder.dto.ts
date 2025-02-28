import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteOrderDTO {
    @IsNotEmpty()
    @IsUUID()
    orderId: string;
}