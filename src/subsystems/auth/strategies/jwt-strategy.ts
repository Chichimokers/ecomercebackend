import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            audience: process.env.GOOGLE_ID_OAUTH,
            algorithms: ['HS256'],
            //issuer: 'https://accounts.google.com', Aqui reside el problema de las ordenes
        });
    }

    async validate(payload: any) {
        return {
            Id: payload.sub,
            name: payload.username,
            role: payload.role,
        };
    }
}
