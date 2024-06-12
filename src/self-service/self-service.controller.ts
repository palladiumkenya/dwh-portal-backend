import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetMetabaseMonthlyHighlightQuery } from './metabase/queries/impl/metabase-monthly-highlight.query';


@Controller('self-service')
export class SelfServiceController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('monthly-highlight')
    async getHtsSites(): Promise<any> {
        return this.queryBus.execute(new GetMetabaseMonthlyHighlightQuery());
    }
}