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
            secretOrKey: process.env.JWT_ACCESS_SECRET || jwtConstants.secret,
            
        });
    }
// jwt.strategy.ts
async validate(payload: any) {
    return {
      Id: payload.sub,
      email: payload.email,
      role: payload.role, // Asigna un valor por defecto si es necesario
    };
  }
}
