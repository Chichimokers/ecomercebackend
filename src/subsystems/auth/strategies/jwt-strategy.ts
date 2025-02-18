import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
//import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: process.env.GOOGLE_ID_OAUTH,
            issuer: 'https://accounts.google.com',
            algorithms: ['HS256'],
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            /*secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
            }),*/
        });
    }


    async validate(payload: any) {
        console.log('Payload JWT recibido:', payload);
        console.log('Secret usado:', process.env.JWT_ACCESS_SECRET);

        return {
            Id: payload.sub,
            name: payload.username,
            email: payload.email,
            role: payload.role,
        };
    }
}
