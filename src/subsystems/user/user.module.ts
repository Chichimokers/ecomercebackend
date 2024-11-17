import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),

        ConfigModule.forRoot({ isGlobal: true }),
    ],

    controllers: [UserController],
    providers: [UserService],

    exports: [UserService],
})
export class UserModule {}
