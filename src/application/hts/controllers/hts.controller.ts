import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetNumberTestedPositivityQuery } from '../queries/get-number-tested-positivity.query';
import { GetUptakeByAgeSexQuery } from '../queries/get-uptake-by-age-sex.query';
import { GetUptakeByPopulationTypeQuery } from '../queries/get-uptake-by-population-type.query';
import { GetUptakeByTestingStrategyQuery } from '../queries/get-uptake-by-testing-strategy.query';
import { GetUptakeByEntryPointQuery } from '../queries/get-uptake-by-entrypoint.query';
import { GetUptakeByCountyQuery } from '../queries/get-uptake-by-county.query';
import { GetUptakeByPartnerQuery } from '../queries/get-uptake-by-partner.query';
import { GetUptakeByTestedasQuery } from '../queries/get-uptake-by-testedas.query';
import { GetUptakeByClientSelfTestedQuery } from '../queries/get-uptake-by-client-self-tested.query';
import { GetUptakeCountiesQuery } from '../queries/get-uptake-counties.query';
import { GetHtsSubCountiesQuery } from '../queries/get-hts-sub-counties.query';
import { GetHtsFacilitiesQuery } from '../queries/get-hts-facilities.query';
import { GetPartnersQuery } from '../../common/queries/get-partners.query';
import { GetHtsPartnersQuery } from '../queries/get-hts-partners.query';

import { GetNumberPositiveLinkedQuery } from '../queries/get-number-positive-linked.query';
import { GetUptakeByAgeSexLinkageQuery } from '../queries/get-uptake-by-age-sex-linkage.query';
import { GetLinkageByPopulationTypeQuery } from '../queries/get-linkage-by-population-type.query';
import { GetLinkageByCountyQuery } from '../queries/get-linkage-by-county.query';
import { GetLinkageByPartnerQuery } from '../queries/get-linkage-by-partner.query';

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

    @Get('uptakeByCounty')
    async getUptakeByCounty(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByCountyQuery();

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

    @Get('uptakeByPartner')
    async getUptakeByPartner(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByPartnerQuery();

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

    @Get('uptakeByClientTestedAs')
    async getUptakeByClientTestedAs(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByTestedasQuery();

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

    @Get('uptakeByClientSelfTested')
    async getUptakeByClientSelfTested(
        @Query('county') county,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByClientSelfTestedQuery();

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


    @Get('counties')
    async getCounties(
    ): Promise<any> {
        const query = new GetUptakeCountiesQuery();
        return this.queryBus.execute(query);
    }

    @Get('subCounties')
    async getSubCounties(
        @Query('county') county
    ): Promise<any> {
        const query = new GetHtsSubCountiesQuery(county);
        return this.queryBus.execute(query);
    }

    @Get('facilities')
    async getFacilities(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetHtsFacilitiesQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('partners')
    async getPartners(
        @Query('county') county,
        @Query('subCounty') subCounty
    ): Promise<any> {
        const query = new GetHtsPartnersQuery();
        if (county) {
            query.county = county;
        }
        if (subCounty) {
            query.subCounty = subCounty;
        }
        return this.queryBus.execute(query);
    }

    @Get('numberPositiveLinked')
    async getNumberPositiveLinked(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetNumberPositiveLinkedQuery();

        if(facility) {
            query.facility = facility;
        }

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByAgeSexLinkage')
    async getUptakeByAgeSexLinkage(
       @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetUptakeByAgeSexLinkageQuery();

        if(facility) {
            query.facility = facility;
        }

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }


        return this.queryBus.execute(query);
    }

    @Get('linkageByPopulationType')
    async getLinkageByPopulationType(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetLinkageByPopulationTypeQuery();

        if(facility) {
            query.facility = facility;
        }

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageByCounty')
    async getLinkageByCounty(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetLinkageByCountyQuery();

        if(facility) {
            query.facility = facility;
        }

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.county = subCounty;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageByPartner')
    async getLinkageByPartner(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetLinkageByPartnerQuery();

        if(facility) {
            query.facility = facility;
        }

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.county = subCounty;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }
}
