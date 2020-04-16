import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): any {
        console.log(process.env.NODE_ENV);
        return this.appService.getHello();
    }
}
