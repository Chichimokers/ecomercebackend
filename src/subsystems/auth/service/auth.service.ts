import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/subsystems/user/entities/user.entity';
import { UserService } from 'src/subsystems/user/service/user.service';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { CodeService } from './code.service';
import { SingUpBody } from "../dto/signupDTO.dto";
import { roles } from "../../roles/enum/roles.enum";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(UserService) private userService: UserService,
        @Inject(CodeService) private CodeServices: CodeService,
        @Inject(JwtService) private jwt: JwtService,

    ) {}

    async sendVerificationEmailSignUp(userdto: CreateUserDto): Promise<any> {
        await this.CodeServices.sendVerificationEmail(userdto);
        return {
            message: 'succesfully mail code send',
            next: '/verify-code-signup',
        };
    }

    async verifiRefreshToken(refreshToken: string): Promise<any | null> {
        try {

          const payload = this.jwt.verify(refreshToken);
      
  
          const user = await this.userRepository.findOne({

            where: { id: payload.sub, refresh_token:refreshToken },

          });
          
      
          if (!user) {
            console.error('El RefreshToken no está asociado a ningún usuario');
            return null;
          }
      
      
          return payload;
        } catch (error) {
          console.error('Error al verificar el RefreshToken:', error.message);
          return null;
        }
      }

    async validateUser(mail: string, password: string): Promise<User> {

        const foundUser: User = await this.userRepository.findOne({
            where: { email: mail },
        });


        if (foundUser) {

            if (await bcrypt.compare(password, foundUser.password)) {
                return foundUser;
            }
            return null;
        }
        return null;
    }

    async validateOAuthuser(user): Promise<User> {
        let foundUser: User = await this.userRepository.findOne({
            where: { email: user.email },
        });
    
        if (!foundUser) {
            // Crear un nuevo usuario automáticamente
            foundUser = this.userRepository.create(
                { name:user.firstName,
                    email: user.email,
                    rol:roles.User, });
            await this.userRepository.save(foundUser);
        }
    
        return foundUser;
    }

    async generate_refreshtoken(payload){

        return this.jwt.sign(payload,{ expiresIn: '7d'})


    }
    async generate_Token(payload){
        return this.jwt.sign(payload,{expiresIn:"1h"})
    }

    async login(user: User): Promise<{ access_token: string ,refreshtoken :string}> {

        const payload = { username: user.name, sub: user.id, role: user.rol };

       const foundUser :User  = await this.userRepository.findOne({
            where:{

                name:user.username,
                email:user.email

        }})

        const refresh_token= await this.generate_refreshtoken(payload);

        foundUser.refresh_token = refresh_token;

        this.userRepository.save(foundUser);

        return {
            access_token: await this.generate_Token(payload),

            refreshtoken:refresh_token

        };
    }

    public getUserDataDTO(singUpBody: SingUpBody): CreateUserDto {
        const userdata = new CreateUserDto();
        userdata.name = singUpBody.username;
        userdata.password = singUpBody.password;
        userdata.email = singUpBody.email;
        userdata.rol = roles.User;
        return userdata;
    }
}
