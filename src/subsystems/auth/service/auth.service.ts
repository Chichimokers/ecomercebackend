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

    async login(user: User): Promise<{ access_token: string }> {
        const payload = { username: user.name, sub: user.id, role: user.rol };

        return {
            access_token: this.jwt.sign(payload),
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
