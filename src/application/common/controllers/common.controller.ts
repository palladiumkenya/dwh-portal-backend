import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountiesQuery } from '../queries/get-counties.query';
import { GetFacilitiesQuery } from '../queries/get-facilities.query';
import { GetPartnersQuery } from '../queries/get-partners.query';
import { GetAgenciesQuery } from '../queries/get-agencies.query';

@Controller('common')
export class CommonController {
    constructor(private readonly queryBus: QueryBus) {
    }

    @Get('counties')
    async getCounties(): Promise<any> {
        return this.queryBus.execute(
            new GetCountiesQuery(),
        );
    }
    @Get('agencies')
    async getAgencies(): Promise<any> {
        return this.queryBus.execute(
            new GetAgenciesQuery(),
        );
    }
    @Get('partners')
    async getPartners(): Promise<any> {
        return this.queryBus.execute(
            new GetPartnersQuery(),
        );
    }

    @Get('facilities')
    async getFacilities(): Promise<any> {
        return this.queryBus.execute(
            new GetFacilitiesQuery(),
        );
    }
}
