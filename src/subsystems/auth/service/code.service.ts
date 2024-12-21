import { BadRequestException, ConflictException, Inject, Injectable } from "@nestjs/common";
import { randomBytes } from 'crypto';
import { MailsService } from '../../mails/services/mails.service';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class CodeService {
    constructor(
        @Inject(MailsService) public mailService: MailsService,
        @Inject(Cache) private cacheManager: Cache,
    ) {}

    async sendVerificationEmail(email: string) {
        const verificationCode = randomBytes(3).toString('hex'); // Genera un código aleatorio de 6 caracteres
        // Aquí podrías almacenar el código y el correo del usuario en una base de datos o en memoria por un tiempo limitado
        const sendmail= await this.mailService.sendVerificationEmail(email, verificationCode);

        if (!sendmail) throw new ConflictException('Error sending verification email');

        await this.cacheManager.set(email, verificationCode, 120000); // Almacena el código en caché por 120 segundos

        return verificationCode;
    }

    async verifyCode(email: string, code: string) {
        // Verifica el código comparando con el almacenado (deberías usar una base de datos o caché)
        const coded: any = await this.cacheManager.get(email);

        if(!coded) throw new BadRequestException('Code expired or not found');

        if (coded == code) {
            await this.cacheManager.del(email); // Elimina el código de la caché
            return true;
        }

        return false; // Lógica de verificación
    }
}
