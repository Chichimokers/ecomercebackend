import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { audit } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET || jwtConstants.secret,
            audience: process.env.GOOGLE_ID_OAUTH, // Client ID de Google
            issuer: 'https://accounts.google.com',
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        return {
            Id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
