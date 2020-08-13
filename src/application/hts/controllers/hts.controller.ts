import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetNumberTestedPositivityQuery } from '../queries/get-number-tested-positivity.query';
import { GetUptakeByAgeSexQuery } from '../queries/get-uptake-by-age-sex.query';
import { GetUptakeByPopulationTypeQuery } from '../queries/get-uptake-by-population-type.query';
import { GetUptakeByTestingStrategyQuery } from '../queries/get-uptake-by-testing-strategy.query';
import { GetUptakeByEntryPointQuery } from '../queries/get-uptake-by-entrypoint.query';

@Controller('hts')
export class HtsController {
    constructor(private readonly queryBus: QueryBus){}

    @Get('numberTestedAndPositivity')
    async getNumberTestedAndPositivity(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetNumberTestedPositivityQuery();

        if(county) {
            query.county = county;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        if(partner) {
            query.partner = partner;
        }

        if(facility) {
            query.facility = facility;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByAgeSex')
    async getUptakeByAgeSex(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByAgeSexQuery();

        if(county) {
            query.county = county;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        if(partner) {
            query.partner = partner;
        }

        if(facility) {
            query.facility = facility;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByPopulationType')
    async getUptakeByPopulationType(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByPopulationTypeQuery();

        if(county) {
            query.county = county;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        if(partner) {
            query.partner = partner;
        }

        if(facility) {
            query.facility = facility;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByTestStrategy')
    async getUptakeByTestStrategy(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByTestingStrategyQuery();

        if(county) {
            query.county = county;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        if(partner) {
            query.partner = partner;
        }

        if(facility) {
            query.facility = facility;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByEntryPoint')
    async getUptakeByEntryPoint(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByEntryPointQuery();

        if(county) {
            query.county = county;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        if(partner) {
            query.partner = partner;
        }

        if(facility) {
            query.facility = facility;
        }

        return this.queryBus.execute(query);
    }
}
