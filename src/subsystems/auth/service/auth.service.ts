import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/subsystems/user/entities/user.entity';
import { UserService } from 'src/subsystems/user/service/user.service';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { CodeService } from './code.service';
import { SingUpBody } from '../dto/signupDTO.dto';
import { roles } from '../../roles/enum/roles.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(UserService) private userService: UserService,
        @Inject(CodeService) private CodeServices: CodeService,
        @Inject(JwtService) private jwt: JwtService,
    ) { }

    async sendVerificationEmailSignUp(userdto: CreateUserDto): Promise<any> {
        await this.CodeServices.sendVerificationEmail(userdto);
        return {
            message: 'succesfully mail code send',
            next: '/verify-code-signup',
        };
    }

    async verifiRefreshToken(refreshToken: string): Promise<any | null> {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: process.env.JWT_SECRET,
            }); // Añadir opciones con secret
            const user = await this.userRepository.findOne({
                where: { id: payload.sub, refresh_token: refreshToken },
            });

            if (!user) {
                console.error('RefreshToken no válido o usuario no existe');
                return null;
            }

            // Verificar expiración del refresh token
            if (payload.exp * 1000 < Date.now()) {
                console.error('RefreshToken expirado');
                return null;
            }

            return user; // Devolver el usuario completo para mayor seguridad
        } catch (error) {
            console.error('Error al verificar RefreshToken:', error.message);
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
            foundUser = this.userRepository.create({
                name: user.firstName,
                email: user.email,
                rol: roles.User,
            });
            await this.userRepository.save(foundUser);
        }

        return foundUser;
    }

    async generate_refreshtoken(payload: any) {
        return this.jwt.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET, // Usar secreto diferente
            expiresIn: '5m',
        });
    }
    async generate_Token(payload: any) {
        return this.jwt.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '2m', // Tiempo de expiración más corto
        });
    }

    // En AuthService
    public async updateRefreshToken(user: User, refreshToken: string) {
        user.refresh_token = refreshToken;
        await this.userRepository.save(user);
    }

    public async updateUser(user: User) {
        await this.userRepository.update(user.id, { refresh_token: null });
    }

    async login(
        user: User,
    ): Promise<{ access_token: string; refresh_token: string }> {
        const payload = { username: user.name, sub: user.id, role: user.rol };

        const foundUser: User = await this.userRepository.findOne({
            where: {
                name: user.username,
                email: user.email,
            },
        });

        const [access_token, refresh_token] = await Promise.all([
            this.generate_Token(payload),
            this.generate_refreshtoken(payload),
        ]);

        foundUser.refresh_token = refresh_token;

        this.userRepository.save(foundUser);

        return {
            access_token: access_token,

            refresh_token: refresh_token,
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
