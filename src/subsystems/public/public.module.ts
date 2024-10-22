import { Module } from "@nestjs/common";
import { PublicController } from "./controllers/public.controller";

@Module({
    controllers: [PublicController],
    providers: [],
    exports: [],
})
export class PublicModule {}