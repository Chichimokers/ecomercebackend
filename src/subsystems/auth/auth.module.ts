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
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { GoogleAuthGuard } from './guards/google.guard';

// Importar JwtStrategy

@Module({
    imports: [
        CacheModule.register({
            ttl: 120,
            max: 100,
        }),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET || jwtConstants.secret,
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
        LocalAuthGuard,
        RolesGuard,
        GoogleAuthGuard,

        CodeService,
    ], // Agregar estrategias aquí
})
export class AuthModule { }
