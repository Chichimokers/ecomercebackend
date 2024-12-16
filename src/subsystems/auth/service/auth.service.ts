import { Injectable, Inject, Body, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/subsystems/user/entities/user.entity';
import { UserService } from 'src/subsystems/user/service/user.service';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { CodeService } from './code.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(UserService) private userService: UserService,
        @Inject(CodeService) private CodeServices: CodeService,
        private jwt: JwtService,
    ) { }

    async signup1(userdto: CreateUserDto): Promise<any> {


        const code = await this.CodeServices.sendVerificationEmail(userdto.email);
    
        return {message:"succesfully mail code send","next":"/verify-code-signup"}
    }

    async signup(userdto: CreateUserDto): Promise<User> {

        const salt: any = await bcrypt.genSalt();

        const hash: any = await bcrypt.hash(userdto.password, salt);

        userdto.password = hash;

        return await this.userService.create({

            rol: roles.User,
            email: userdto.email,
            name: userdto.name,
            password: userdto.password,

        })
    }

    async validateUser(username: string, password: string): Promise<User> {
        const foundUser: User = await this.userRepository.findOne({
            where: { name: username },
        });

        if (foundUser) {
            if (await bcrypt.compare(password, foundUser.password)) {
                return foundUser;
            }

            return null;
        }

        return null;
    }

    async login(user: User): Promise<{access_token: string}> {

        const payload = { username: user.name, sub: user.id, role: user.rol };

        return {
            access_token: this.jwt.sign(payload),
        };
    }
}
