import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, isString } from "class-validator";
import { BaseDto } from "src/common/dto/base.dto";

export class RefresTokenDTO extends BaseDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "resfreshtoken",
        description: "ma333333",
    })
    readonly refresh_token: string;

}
