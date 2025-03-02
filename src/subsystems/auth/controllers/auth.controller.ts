import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginBody } from '../dto/loginDTO.dto';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { SingUpBody } from '../dto/signupDTO.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { CodeService } from '../service/code.service';
import { SingUpBodyVerifcation } from '../dto/verficationDTO.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from '../guards/google.guard';
import { RefresTokenDTO } from '../dto/refrestoken.dto';

@ApiTags('login')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authservice: AuthService,
        @Inject(CodeService) private CodeServices: CodeService,
    ) { }

    // Endpoint para enviar el código de verificación
    @Post('send-verification')
    async sendVerification(@Body() singUpBody: SingUpBody) {
        const userdata: CreateUserDto =
            this.authservice.getUserDataDTO(singUpBody);

        await this.CodeServices.sendVerificationEmail(userdata);

        return { message: 'Verification code sent' };
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // Esta ruta redirige al usuario a Google
    }

    @Post('google/token-exchange')
    async googleTokenExchange(@Body() body: { token: string }) {
        try {
            const { token } = body;

            // Validar token con Google
            const socialUser =
                await this.authservice.validateGoogleToken(token);

            if (!socialUser?.email) {
                throw new UnauthorizedException('Token de Google inválido');
            }

            const user = await this.authservice.validateOAuthuser({
                email: socialUser.email,
                name: socialUser.name,
            });

            const tokens = await this.authservice.login(user);

            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expiresIn: 900,
                user: {
                    email: user.email,
                    name: user.name,
                    id: user.id,
                },
            };
        } catch (error) {
            throw new UnauthorizedException({
                error: 'GOOGLE_TOKEN_EXCHANGE_FAILED',
                message: error.message,
            });
        }
    }

    // Mejorar el endpoint de refresh
    @Post('refresh-token')
    async refresh_token(@Body() token: RefresTokenDTO) {
        try {
            const user = await this.authservice.verifirefresh_token(
                token.refresh_token,
            );

            if (!user) {
                throw new UnauthorizedException('Refresh Token revocado');
            }

            // Generar nuevos tokens con rotación
            const tokens = await this.authservice.generateTokens(user);

            // Actualizar en base de datos ANTES de responder
            await this.authservice.updaterefresh_token(
                user.id,
                tokens.refresh_token,
            );

            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expiresIn: tokens.expiresIn, // 15 minutos en segundos
            };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Post('/login')
    async Login(@Body() loginBody: LoginBody): Promise<string> {
        try {
            const resultLogin: User = await this.authservice.validateUser(
                loginBody.email,
                loginBody.password,
            );

            if (resultLogin != null) {
                return JSON.stringify(
                    await this.authservice.login(resultLogin),
                );
            } else {
                return JSON.stringify({
                    error: 'login error some parameter are incorrects',
                });
            }
        } catch (UnauthorizedException) {
            return JSON.stringify({ error: UnauthorizedException });
        }
    }

    @Post('/signup')
    async SingUp(@Body() logindata: SingUpBody): Promise<string> {
        try {
            const userdata: CreateUserDto =
                this.authservice.getUserDataDTO(logindata);

            const signupresult =
                await this.authservice.sendVerificationEmailSignUp(userdata);

            if (signupresult != null) {
                return JSON.stringify({ user: signupresult });
            } else {
                return JSON.stringify({ error: 'Error sending email' });
            }
        } catch (UnauthorizedException) {
            return JSON.stringify({ error: UnauthorizedException });
        }
    }
    // Endpoint para verificar el registro
    @Post('verify-code-signup')
    async verifyCode(@Body() logindata: SingUpBodyVerifcation) {
        const verifiedCode: boolean = await this.CodeServices.verifyCode(
            logindata.email,
            logindata.code,
        );

        if (verifiedCode == false) {
            throw new BadRequestException('Invalid code');
        }
        return { message: 'User verified and created, you can login!' };
    }
}
