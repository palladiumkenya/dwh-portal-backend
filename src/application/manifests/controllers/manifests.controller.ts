import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetTilesQuery } from '../queries/get-tiles.query';

@Controller('manifests')
export class ManifestsController {
    constructor(private readonly queryBus: QueryBus) {
    }

    @Get('expected/:docket')
    async getCounties(@Param('docket') docket): Promise<any> {
        return this.queryBus.execute(new GetTilesQuery(docket));
    }

}
