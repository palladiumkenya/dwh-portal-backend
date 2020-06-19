import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetExpectedUploadsQuery } from '../queries/get-expected-uploads.query';
import { GetRecencyUploadsQuery } from '../queries/get-recency-uploads.query';
import { GetConsistencyUploadsQuery } from '../queries/get-consistency-uploads.query';
import { GetTrendsRecencyQuery } from '../queries/get-trends-recency.query';
import { GetTrendsConsistencyQuery } from '../queries/get-trends-consistency.query';

@Controller('manifests')
export class ManifestsController {
    constructor(private readonly queryBus: QueryBus) {
    }

    @Get('expected/:docket')
    async getUploads(
        @Param('docket') docket,
        @Query('county') county,
        @Query('agency') agency,
        @Query('partner') partner,
    ): Promise<any> {
        const query = new GetExpectedUploadsQuery(docket);
        if (county) {
            query.county = county;
        }
        if (agency) {
            query.agency = agency;
        }
        if (partner) {
            query.partner = partner;
        }
        return this.queryBus.execute(query);
    }

    @Get('recency/:docket')
    async getRecency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('agency') agency,
        @Query('partner') partner,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetRecencyUploadsQuery(docket);
        if (county) {
            query.county = county;
        }
        if (agency) {
            query.agency = agency;
        }
        if (partner) {
            query.partner = partner;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('consistency/:docket')
    async getConsistency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('agency') agency,
        @Query('partner') partner,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetConsistencyUploadsQuery(docket);
        if (county) {
            query.county = county;
        }
        if (agency) {
            query.agency = agency;
        }
        if (partner) {
            query.partner = partner;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('recency/trends/:docket')
    async getTrendsRecency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('agency') agency,
        @Query('partner') partner,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetTrendsRecencyQuery(docket);
        if (county) {
            query.county = county;
        }
        if (agency) {
            query.agency = agency;
        }
        if (partner) {
            query.partner = partner;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('consistency/trends/:docket')
    async getTrendsConsistency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('agency') agency,
        @Query('partner') partner,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetTrendsConsistencyQuery(docket);
        if (county) {
            query.county = county;
        }
        if (agency) {
            query.agency = agency;
        }
        if (partner) {
            query.partner = partner;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

}
