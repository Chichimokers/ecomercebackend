import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    getHello(): string {
        
        
return "Asere tengo ganas de terminar esto ya pinga";

    }
    @Get("/debug-sentry")
getError() {
  throw new Error("My first Sentry error!");
}
    
}
