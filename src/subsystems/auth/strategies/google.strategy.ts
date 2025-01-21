import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../service/auth.service';
import { GOOGLE_SECRET_KEY,GOOGLE_ID_OAUTH,GOOGLE_CALLBACK_URL } from '../google.config';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {

    super({
      clientID: process.env.GOOGLE_CLIENT_ID||GOOGLE_ID_OAUTH,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET||GOOGLE_SECRET_KEY,
      callbackURL: process.env.GOOGLE_CALLBACK_URL||GOOGLE_CALLBACK_URL,

      scope: ['email', 'profile'], // Datos a solicitar a Google

    });
    
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    // Crear un objeto basado en el perfil de Google
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    // Validar el usuario con AuthService
    const existingUser = await this.authService.validateOAuthuser(user)
    
    return done(null, existingUser || user); // Retorna el usuario o lo registra
  }
}
