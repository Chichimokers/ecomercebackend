import { BadRequestException, Body, Controller, Inject, Post } from "@nestjs/common";
import { roles } from '../../roles/enum/roles.enum';
import { AuthService } from '../service/auth.service';
import { LoginBody } from '../dto/loginDTO.dto';
import { CreateUserDto } from 'src/subsystems/user/dto';
import { SingUpBody } from '../dto/signupDTO.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { CodeService } from '../service/code.service';
import { SingUpBodyVerifcation } from '../dto/verficationDTO.dto';

@ApiTags('login')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authservice: AuthService,
        @Inject(CodeService) private CodeServices: CodeService,
    ) {}
    // Endpoint para enviar el código de verificación
    @Post('send-verification')
    async sendVerification(@Body('email') email: string) {
        console.log(email);

        await this.CodeServices.sendVerificationEmail(email);

        return { message: 'Verification code sent' };
    }

    @Post('/login')
    async Login(@Body() logindata: LoginBody): Promise<string> {
        try {
            const resultlogin: User = await this.authservice.validateUser(
                logindata.mail,
                logindata.password,
            );

            if (resultlogin != null) {
                return JSON.stringify(
                    await this.authservice.login(resultlogin),
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
            const newuser = new CreateUserDto();
            newuser.name = logindata.username;
            newuser.password = logindata.password;
            newuser.email = logindata.email;
            newuser.rol = roles.User;

            const signupresult = await this.authservice.sendVerificationEmailSignUp(newuser);

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
        const verifiedCode = await this.CodeServices.verifyCode(
            logindata.email,
            logindata.code,
        );

        if (!verifiedCode) throw new BadRequestException('Invalid code');

        try {
            const newuser = new CreateUserDto();
            newuser.name = logindata.username;
            newuser.password = logindata.password;
            newuser.email = logindata.email;
            newuser.rol = roles.User;

            const signupresult: User = await this.authservice.signup(newuser);

            if (signupresult != null) {
                return JSON.stringify({ user: signupresult });
            } else {
                return JSON.stringify({ error: 'Error creating the user' });
            }
        } catch (UnauthorizedException) {
            return JSON.stringify({ error: UnauthorizedException });
        }
    }
}
