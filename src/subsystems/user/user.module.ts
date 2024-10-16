import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './service/user.service';

@Module({
imports:[
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({ isGlobal: true })
],
exports: [UsersService],
})
export class UserModule {}
