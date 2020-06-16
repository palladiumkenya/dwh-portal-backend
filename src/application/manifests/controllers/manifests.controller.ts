import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetTilesQuery } from '../queries/get-tiles.query';
import { GetTrendsQuery } from '../queries/get-trends.query';
import { GetPartnersQuery } from '../../common/queries/get-partners.query';
import { GetExpectedUploadsQuery } from '../queries/get-expected-uploads.query';
import { GetOverallUploadsQuery } from '../queries/get-overall-uploads.query';

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

    @Get('overall/:docket')
    async getOverall(
        @Param('docket') docket,
        @Query('county') county,
        @Query('agency') agency,
        @Query('partner') partner,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetOverallUploadsQuery(docket);
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

    @Get('trends/:docket/:year/:month')
    async getTrendss(@Param('docket') docket, @Param('year') year, @Param('month') month): Promise<any> {
        return this.queryBus.execute(new GetTrendsQuery(docket, year, month));
    }

}
