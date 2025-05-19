import { ApiTags } from "@nestjs/swagger";
import {
    Body,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Post,
    Query,
    UnauthorizedException
} from "@nestjs/common";
import { GetUrlDto, SetUrlDto } from "../dto/test.dto";
import { Cache } from "@nestjs/cache-manager";

@ApiTags("Test")
@Controller("test")
export class TestController {
    constructor(
        @Inject(Cache)
        private readonly cacheService: Cache
    ) {
    }

    @Get("get-url")
    async getUrl(@Query('code') code: string) {
        if (
            !code
            || code.length != 32
            || code != "CsTyOlBaVzRxSmKgQoRyQbKvHhThBiLo") {
            throw new UnauthorizedException("Unauthorized");
        }

        const object = await this.cacheService.get("test-url");
        if (!object) {
            throw new NotFoundException("There isn's url establish yet");
        }

        return object;
    }

    @Post("set-url")
    async setUrl(@Body() data: SetUrlDto) {
        if (
            data.code.length != 32
            || data.code != "CsTyOlBaVzRxSmKgQoRyQbKvHhThBiLo") {
            throw new UnauthorizedException("Unauthorized");
        }

        const object: GetUrlDto = {
            url: data.url,
            date: new Date(),
            connect: true,
        }

        await this.cacheService.set("test-url", object, data.time * 60 * 1000);
        return {
            status: "success",
            message: "URL set successfully",
        };
    }

    @Post("clear-ur")
    async clearUrl(@Query('code') code: string) {
        if (
            !code
            ||code.length != 32
            || code != "CsTyOlBaVzRxSmKgQoRyQbKvHhThBiLo") {
            throw new UnauthorizedException("Unauthorized");
        }

        await this.cacheService.del("test-url");

        return {
            status: "success",
            message: "URL deleted successfully",
        }
    }
}