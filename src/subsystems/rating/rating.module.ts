import { Module } from '@nestjs/common';
import { RatingController } from './controller/rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RatingEntity } from './entity/rating.entity';
import { RatingService } from "./services/rating.service";
import { User } from "../user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([RatingEntity, User]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [RatingController],
    providers: [RatingService],
})
export class RatingModule {}
