import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SetUrlDto {
    @ApiProperty({
        type: String,
        required: true,
        description: "URL to set",
    })
    @IsNotEmpty()
    @IsString()
    url: string;

    @ApiProperty({
        type: String,
        required: true,
        description: "Code to set",
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        type: Number,
        required: true,
        description: "Time to set in minutes",
    })
    @IsInt()
    @IsNotEmpty()
    time: number;
}

export class GetUrlBodyDto {
    @ApiProperty({
        type: String,
        required: true,
        description: "Code to get",
    })
    @IsNotEmpty()
    @IsString()
    code: string;
}

export class GetUrlDto {
    url: string;
    date: Date;
    connect: boolean;
}