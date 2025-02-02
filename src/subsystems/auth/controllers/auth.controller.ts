import { BadRequestException, Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from '../service/auth.service';
import { LoginBody } from '../dto/loginDTO.dto';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { SingUpBody } from '../dto/signupDTO.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { CodeService } from '../service/code.service';
import { SingUpBodyVerifcation } from '../dto/verficationDTO.dto';
import { AuthGuard } from "@nestjs/passport";
import { GoogleAuthGuard } from "../guards/google.guard";

@ApiTags('login')

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authservice: AuthService,
        @Inject(CodeService) private CodeServices: CodeService,
    ) {}

    // Endpoint para enviar el código de verificación
    @Post('send-verification')
    async sendVerification(@Body() singUpBody: SingUpBody) {
        const userdata: CreateUserDto = this.authservice.getUserDataDTO(singUpBody);

        await this.CodeServices.sendVerificationEmail(userdata);

        return { message: 'Verification code sent' };
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {

        // Esta ruta redirige al usuario a Google

    }

    // Endpoint que recibe el callback de Google
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))

    async googleAuthRedirect(@Req() req) {

        const user = req.user;


        const userfound = await this.authservice.validateOAuthuser(user);

        const token = await this.authservice.login(userfound);
        // Opcional: Generar un JWT para el usuario autenticado
    

        return {
        message: 'Authenticated with Google',
        token,
        };
        
    }



    @Post('/login')
    async Login(@Body() loginBody: LoginBody): Promise<string> {
        try {
            const resultLogin: User = await this.authservice.validateUser(
                loginBody.mail,
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
            const userdata: CreateUserDto = this.authservice.getUserDataDTO(logindata);

            const signupresult = await this.authservice.sendVerificationEmailSignUp(userdata);

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
        const verifiedCode :boolean = await this.CodeServices.verifyCode(
            logindata.email,
            logindata.code,
        );

        
        if (verifiedCode== false){ throw new BadRequestException('Invalid code')};
        return { message: 'User verified and created, you can login!' };
    }
}
