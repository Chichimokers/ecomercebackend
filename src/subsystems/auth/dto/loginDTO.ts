import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { BaseDto } from "src/common/dto/base.dto";



export class LoginBody  extends BaseDto{
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @MaxLength(20, { message: 'Name must have max 20 characters.' })
  @IsNotEmpty() 
  @ApiProperty({
    example: "ernest",
    description: "userame used in signup",
})
    readonly username: string;

    @ApiProperty({
      example: "123233",
      description: "password",
   })
    @IsNotEmpty() 
    readonly password: string;
  }
