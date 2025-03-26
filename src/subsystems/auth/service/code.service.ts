import { BadRequestException, ConflictException, Inject, Injectable } from "@nestjs/common";
import { randomBytes } from 'crypto';
import { MailsService } from '../../mails/services/mails.service';
import { Cache } from '@nestjs/cache-manager';
import { CreateUserDto } from "../../user/dto";
import { roles } from "../../roles/enum/roles.enum";
import * as bcrypt from 'bcrypt';
import { UserService } from "../../user/service/user.service";
import { IsEmail } from 'class-validator';

@Injectable()
export class CodeService {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(MailsService) private mailService: MailsService,
        @Inject(Cache) private cacheManager: Cache,
    ) {}

    async sendVerificationEmail(user: CreateUserDto) {
        
        const verificationCode = randomBytes(3).toString('hex'); // Genera un código aleatorio de 6 caracteres
        // Aquí podrías almacenar el código y el correo del usuario en una base de datos o en memoria por un tiempo limitado
        const sendmail= await this.mailService.sendVerificationEmail(user.email, verificationCode);

        if (!sendmail) throw new ConflictException('Error sending verification email');

        const userdata = {
            username: user.name,
            email: user.email,
            password: user.password,
            code: verificationCode,
        }

        await this.cacheManager.set(user.email, userdata, 120000); // Almacena el código en caché por 120 segundos

        return verificationCode;
    }
    async sendLInkEmail(email: string) {
        
        const linkid = randomBytes(6).toString('hex'); // Genera un código aleatorio de 6 caracteres
        // Aquí podrías almacenar el código y el correo del usuario en una base de datos o en memoria por un tiempo limitado
        const sendmail= await this.mailService.sendChangePAssMail(email, linkid);

        if (!sendmail) throw new ConflictException('Error sending link email');

        const userdata = {
       
            email: email,
            
            passchange:linkid
        }

        await this.cacheManager.set(email, userdata, 120000); // Almacena el código en caché por 120 segundos

        return linkid;
    }
    async getMailUserforLink(id:string){
        const data : any = await this.cacheManager.get(id)
        return  data.email

    }
    async verifyCode(email: string, code: string) {
        // Verifica el código comparando con el almacenado (deberías usar una base de datos o caché)
        const coded: any = await this.cacheManager.get(email);

        if(!coded) throw new BadRequestException('Code expired or not found');

        if (coded.code == code) {
            const salt = await bcrypt.genSalt();

             await this.userService.create({
                rol: roles.User,
                email: coded.email,
                name: coded.username,
                password: await bcrypt.hash(coded.password, salt),
            });

            await this.cacheManager.del(email); // Elimina el código de la caché
            return true;
        }

        return false; // Lógica de verificación
    }
}
