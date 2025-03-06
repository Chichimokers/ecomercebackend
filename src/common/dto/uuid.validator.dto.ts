import { IsNotEmpty, IsUUID } from "class-validator";

export class IDDTO {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}