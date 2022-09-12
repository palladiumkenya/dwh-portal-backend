import { Controller, Get } from '@nestjs/common';
import { MetabaseService } from './providers/metabase.service';

@Controller('self-service')
export class SelfServiceController {

    constructor(private metabaseService: MetabaseService){}

    @Get('metabase')
     async metabaseLogin(): Promise<any[]>{
       return (await this.metabaseService.login()).data;
    }
}
