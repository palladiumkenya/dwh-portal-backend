import { Controller, Get, Param, Query } from '@nestjs/common';
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
    async getAgencies(
        @Query('county') county,
    ): Promise<any> {
        const query = new GetAgenciesQuery();
        if (county) {
            query.county = county;
        }
        return this.queryBus.execute(query);
    }

    @Get('partners')
    async getPartners(
        @Query('county') county,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetPartnersQuery();
        if (county) {
            query.county = county;
        }
        if (agency) {
            query.agency = agency;
        }
        return this.queryBus.execute(query);
    }

    @Get('facilities')
    async getFacilities(): Promise<any> {
        return this.queryBus.execute(
            new GetFacilitiesQuery(),
        );
    }
}
