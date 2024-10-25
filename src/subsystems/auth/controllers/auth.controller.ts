import { Body, Controller, Post } from '@nestjs/common';

import { roles } from '../../roles/enum/roles.enum';
import { AuthService } from '../service/auth.service';
import { LoginBody } from '../dto/loginDTO';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { SingUpBody } from '../dto/signupDTO';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('login')
@Controller("auth")
export class AuthController {
  constructor(private authservice :AuthService) {

  }

  @Post("/login")
  async Login(@Body() logindata : LoginBody): Promise<string> {
    try{

   const resultlogin = await this.authservice.validateUser(logindata.username,logindata.password);

   if(resultlogin != null ){

    return JSON.stringify(await this.authservice.login(resultlogin));

   }else{

    return JSON.stringify({error:"login error some parameter are incorrects"});

   }
   
  }catch(UnauthorizedException){
    return JSON.stringify({"error":UnauthorizedException})
  
  }

  }


  @Post("/singup")
  async SingUp(@Body() logindata : SingUpBody): Promise<string> {
    try{

   
    const newuser = new CreateUserDto()
    newuser.name = logindata.username;
    newuser.password = logindata.password;
    newuser.email = logindata.email;
    newuser.rol = roles.User;
  
    const signupresult = await this.authservice.signup(newuser);

    if(signupresult != null) {
     return JSON.stringify({user:signupresult})

    }else{
      return JSON.stringify({error:"Error creating the user"})
    }

  }catch(UnauthorizedException){
    return JSON.stringify({"error" : UnauthorizedException})
  
  }
    

}

}