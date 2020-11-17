import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountiesQuery } from './queries/impl/get-counties.query';
import { GetFacilitiesQuery } from './queries/impl/get-facilities.query';
import { GetPartnersQuery } from './queries/impl/get-partners.query';
import { GetAgenciesQuery } from './queries/impl/get-agencies.query';
import { GetSubCountiesQuery } from './queries/impl/get-sub-counties.query';

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

    @Get('subCounties')
    async getSubCounties(
        @Query('county') county
    ): Promise<any> {
        const query = new GetSubCountiesQuery(county);
        return this.queryBus.execute(query);
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
    async getFacilities(
        @Query('county') county,
        @Query('subCounty') subCounty
    ): Promise<any> {
        const query = new GetFacilitiesQuery();

        if(county) {
            query.counties = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        return this.queryBus.execute(query);
    }
}
