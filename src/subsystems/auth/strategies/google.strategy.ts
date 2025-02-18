import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../service/auth.service';
import {
  GOOGLE_SECRET_KEY,
  GOOGLE_ID_OAUTH,
  GOOGLE_CALLBACK_URL,
} from '../google.config';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || GOOGLE_ID_OAUTH,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_SECRET_KEY,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['email', 'profile'],
      accessType: 'offline',
      responseType: 'code',
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { emails, name, photos } = profile;

      // Validar y normalizar datos
      const userData = {
        email: emails[0].value,
        name: name?.givenName || emails[0].value.split('@')[0],
        picture: photos?.[0]?.value || '',
        access_token,
      };

      // Registrar o validar usuario en tu sistema
      const user = await this.authService.validateOAuthuser(userData);

      return done(null, {
        id: user.id,
        email: user.email,
        name: user.name,
        access_token,
      });
    } catch (error) {
      return done(error, false);
    }
  }
}
