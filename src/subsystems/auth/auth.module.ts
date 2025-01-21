import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt-strategy';
import { AuthService } from './service/auth.service';
import { User } from '../user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '../user/service/user.service';
import { CodeService } from './service/code.service';
import { MailsService } from '../mails/services/mails.service';
import { CacheModule } from "@nestjs/cache-manager";
import { GoogleStrategy } from './strategies/google.strategy';

// Importar JwtStrategy

@Module({
    imports: [
        CacheModule.register({
            ttl: 120, // Time in seconds
            max: 100, // Max number of items in cache
        }),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        MailsService,
        UserService,
        AuthService,
        JwtStrategy,
        GoogleStrategy,
        CodeService,
    ], // Agregar estrategias aquí
})
export class AuthModule {}
