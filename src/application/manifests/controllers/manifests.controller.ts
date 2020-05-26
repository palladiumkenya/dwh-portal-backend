import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetTilesQuery } from '../queries/get-tiles.query';

@Controller('manifests')
export class ManifestsController {
    constructor(private readonly queryBus: QueryBus) {
    }

    @Get('/:docket/:year/:month')
    async getUploads(@Param('docket') docket, @Param('year') year, @Param('month') month): Promise<any> {
        return this.queryBus.execute(new GetTilesQuery(docket, year, month));
    }

}
