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
            algorithms: ['RS256'],
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
        return {
            Id: payload.sub,
            name: payload.username,
            email: payload.email,
        };
    }
}
