import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/subsystems/user/entities/user.entity';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { CodeService } from './code.service';
import { SingUpBody } from '../dto/signupDTO.dto';
import { roles } from '../../roles/enum/roles.enum';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(DataSource) private dataSource: DataSource,
        @Inject(CodeService) private CodeServices: CodeService,
        @Inject(JwtService) private jwt: JwtService,
    ) {
        this.googleClient = new OAuth2Client(
            process.env.GOOGLE_ID_OAUTH,
            process.env.GOOGLE_SECRET_KEY,
        );
    }

    async sendVerificationEmailSignUp(userdto: CreateUserDto): Promise<any> {
        await this.CodeServices.sendVerificationEmail(userdto);
        return {
            message: 'succesfully mail code send',
            next: '/verify-code-signup',
        };
    }

    // En el servicio de autenticación (auth.service.ts)
    async verifirefresh_token(refresh_token: string): Promise<User | null> {
        if (!refresh_token) {
            console.error('Refresh token no proporcionado');
            return null;
        }

        try {
            const payload = this.jwt.verify(refresh_token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            // Usar una transacción para consistencia
            return await this.dataSource.transaction(
                async (transactionalEntityManager) => {
                    const user = await transactionalEntityManager.findOne(
                        User,
                        {
                            where: { id: payload.sub },
                            lock: { mode: 'pessimistic_write' },
                        },
                    );

                    if (!user || user.refresh_token !== refresh_token) {
                        console.error(
                            'refresh_token no coincide o usuario no existe',
                        );
                        return null;
                    }

                    if (payload.exp * 1000 < Date.now()) {
                        console.error('refresh_token expirado');
                        return null;
                    }

                    return user;
                },
            );
        } catch (error) {
            console.error('Error en verificación:', error.message);
            return null;
        }
    }

    async updaterefresh_token(
        userId: string,
        newrefresh_token: string,
    ): Promise<void> {
        await this.dataSource
            .getRepository(User)
            .update({ id: userId }, { refresh_token: newrefresh_token });
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
        const existingUser = await this.userRepository.findOne({
            where: { email: user.email },
            //relations: ['roles'],
        });

        if (!existingUser) {
            const newUser = this.userRepository.create({
                name: user.name,
                email: user.email,
                rol: roles.User,
            });

            return this.userRepository.save(newUser);
        }
        return existingUser;
    }

    async generateTokens(user: User) {
        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.rol,
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '60m',
            }),
            this.jwt.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);

        await this.updaterefresh_token(user.id, refresh_token);

        return {
            access_token,
            refresh_token,
            expiresIn: 900,
        };
    }

    public async updateUser(user: User) {
        await this.userRepository.update(user.id, { refresh_token: null });
    }

    async login(
        user: User,
    ): Promise<{ access_token: string; refresh_token: string }> {

        const foundUser: User = await this.userRepository.findOne({
            where: {
                name: user.username,
                email: user.email,
            },
        });

        const tokens = await Promise.all([this.generateTokens(user)]);

        foundUser.refresh_token = tokens[0].refresh_token;

        await this.userRepository.save(foundUser);

        return {
            access_token: tokens[0].access_token,
            refresh_token: tokens[0].refresh_token,
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

    async validateGoogleToken(token: string) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                
                idToken: token,
                audience: process.env.GOOGLE_ID_OAUTH,
            });

            return ticket.getPayload();
        } catch (error) {
            throw new UnauthorizedException('Token de Google inválido');
        }
    }
}
