import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PublicService } from "./services/public.service";
import { PublicController } from "./controllers/public.controller";


@Module({
    imports:[
        TypeOrmModule.forFeature([]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    providers: [PublicService],
    controllers: [PublicController],
})
export class PublicModule {}