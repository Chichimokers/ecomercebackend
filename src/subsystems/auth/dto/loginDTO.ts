import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";



export class LoginBody {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @MaxLength(20, { message: 'Name must have max 20 characters.' })
  @IsNotEmpty() 
    readonly username: string;


    @IsNotEmpty() 
    readonly password: string;
  }
