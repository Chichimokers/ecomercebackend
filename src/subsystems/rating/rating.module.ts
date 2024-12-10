import { Module } from '@nestjs/common';
import { RatingController } from './controller/rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RatingEntity } from './entity/rating.entity';
import { RatingService } from "./services/rating.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([RatingEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [RatingController],
    providers: [RatingService],
})
export class RatingModule {}
