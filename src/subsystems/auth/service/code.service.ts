import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { randomBytes } from 'crypto';
import { MailsService } from '../../mails/services/mails.service';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class CodeService {
    //codelist = [];
    constructor(
        @Inject(MailsService) public mailService: MailsService,
        @Inject(Cache) private cacheManager: Cache,
    ) {}

    // TODO DELETE UNNECESSARY CODE
    /*
    async getcode(email: string) {
        this.codelist.forEach((element) => {
            if (element.email == email) return element.code;
        });
    }
    async removecode(email: string) {
        // Buscar el índice del elemento que tiene el mismo email
        const index = this.codelist.findIndex(
            (element) => element.email === email,
        );

        if (index !== -1) {
            // Si se encuentra el elemento, eliminarlo de la lista
            this.codelist.splice(index, 1); // Elimina 1 elemento en la posición index
            console.log(`Código de verificación para ${email} eliminado.`);
        } else {
            console.log(`No se encontró ningún código para ${email}.`);
        }
    }
    */

    async sendVerificationEmail(email: string) {
        const verificationCode = randomBytes(3).toString('hex'); // Genera un código aleatorio de 6 caracteres
        // Aquí podrías almacenar el código y el correo del usuario en una base de datos o en memoria por un tiempo limitado
        const sendmail =await this.mailService.sendVerificationEmail(email, verificationCode);

        if (!sendmail) throw new ConflictException('Error sending verification email');

        await this.cacheManager.set(email, verificationCode, 120000); // Almacena el código en caché por 120 segundos

        return verificationCode;
    }

    // Método para verificar el código
    async verifyCode(email: string, code: string) {
        // Verifica el código comparando con el almacenado (deberías usar una base de datos o caché)
        const coded: any = this.cacheManager.get(email);

        if (coded == code) {
            await this.cacheManager.del(email); // Elimina el código de la caché
            return true;
        }

        return false; // Lógica de verificación
    }
}
