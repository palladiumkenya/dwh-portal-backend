import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetHtsSubCountiesQuery } from './uptake/queries/impl/get-hts-sub-counties.query';
import { GetHtsFacilitiesQuery } from './uptake/queries/impl/get-hts-facilities.query';
import { GetHtsPartnersQuery } from './uptake/queries/impl/get-hts-partners.query';
import { GetUptakeByAgeSexQuery } from './uptake/queries/impl/get-uptake-by-age-sex.query';
import { GetUptakeByPopulationTypeQuery } from './uptake/queries/impl/get-uptake-by-population-type.query';
import { GetUptakeByTestingStrategyQuery } from './uptake/queries/impl/get-uptake-by-testing-strategy.query';
import { GetUptakeByEntryPointQuery } from './uptake/queries/impl/get-uptake-by-entrypoint.query';
import { GetUptakeByCountyQuery } from './uptake/queries/impl/get-uptake-by-county.query';
import { GetUptakeByPartnerQuery } from './uptake/queries/impl/get-uptake-by-partner.query';
import { GetUptakeByTestedasQuery } from './uptake/queries/impl/get-uptake-by-testedas.query';
import { GetUptakeByClientSelfTestedQuery } from './uptake/queries/impl/get-uptake-by-client-self-tested.query';
import { GetUptakeCountiesQuery } from './uptake/queries/impl/get-uptake-counties.query';
import { GetUptakeByMonthsSinceLastTestQuery } from './uptake/queries/impl/get-uptake-by-months-since-last-test.query';
import { GetUptakeByTbScreeningQuery } from './uptake/queries/impl/get-uptake-by-tb-screening.query';
import { GetUptakeByTbScreenedQuery } from './uptake/queries/impl/get-uptake-by-tb-screened.query';
import { GetUptakeByAgeSexPositivityQuery } from './uptake/queries/impl/get-uptake-by-age-sex-positivity.query';
import { GetUptakeByPositivityQuery } from './uptake/queries/impl/get-uptake-by-positivity.query';

import { GetNumberTestedPositivityQuery } from './linkage/queries/impl/get-number-tested-positivity.query';
import { GetLinkageNumberPositiveQuery } from './linkage/queries/impl/get-linkage-number-positive.query';
import { GetLinkageByAgeSexQuery } from './linkage/queries/impl/get-linkage-by-age-sex.query';
import { GetLinkageByPopulationTypeQuery } from './linkage/queries/impl/get-linkage-by-population-type.query';
import { GetLinkageByEntryPointQuery } from './linkage/queries/impl/get-linkage-by-entry-point.query';
import { GetLinkageByStrategyQuery } from './linkage/queries/impl/get-linkage-by-strategy.query';
import { GetLinkageByCountyQuery } from './linkage/queries/impl/get-linkage-by-county.query';
import { GetLinkageByPartnerQuery } from './linkage/queries/impl/get-linkage-by-partner.query';

import { GetPnsSexualContactsCascadeQuery } from './pns/queries/impl/get-pns-sexual-contacts-cascade.query';
import { GetPnsSexualContactsByAgeSexQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-age-sex.query';
import { GetPnsSexualContactsByYearQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-year.query';
import { GetPnsSexualContactsByPartnerQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-partner.query';
import { GetPnsSexualContactsByCountyQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-county.query';
import { GetPnsChildrenCascadeQuery } from './pns/queries/impl/get-pns-children-cascade.query';
import { GetPnsChildrenByYearQuery } from './pns/queries/impl/get-pns-children-by-year.query';
import { GetPnsIndexQuery } from './pns/queries/impl/get-pns-index.query';

@Controller('hts')
export class HtsController {
    constructor(private readonly queryBus: QueryBus){}

    @Get('numberTestedAndPositivity')
    async getNumberTestedAndPositivity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetNumberTestedPositivityQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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

    @Get('uptakeByPositivity')
    async getUptakeByPositivity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByPositivityQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByAgeSexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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

    @Get('uptakeByAgeSexPositivity')
    async getUptakeByAgeSexPositivity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByAgeSexPositivityQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByPopulationTypeQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByTestingStrategyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByEntryPointQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByTestedasQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetUptakeByClientSelfTestedQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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

    @Get('linkageNumberPositive')
    async getLinkageNumberPositive(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetLinkageNumberPositiveQuery();

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

    @Get('monthsSinceLastTest')
    async getMonthsSinceLastTest(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetUptakeByMonthsSinceLastTestQuery();

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

    @Get('tbScreeningOutcomes')
    async getTbScreeningOutcomes(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetUptakeByTbScreeningQuery();

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

    @Get('tbScreened')
    async gettbScreened(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetUptakeByTbScreenedQuery();

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

    @Get('linkageByAgeSex')
    async getLinkageByAgeSex(
       @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetLinkageByAgeSexQuery();

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

    @Get('linkageByEntryPoint')
    async getLinkageByEntryPoint(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetLinkageByEntryPointQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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

    @Get('linkageByStrategy')
    async getLinkageByStrategy(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility
    ): Promise<any> {
        const query = new GetLinkageByStrategyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
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

    @Get('pnsSexualContactsCascade')
    async GetPnsSexualContactsCascade(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsSexualContactsCascadeQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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
    
    @Get('pnsChildrenCascade')
    async GetPnsChildrenCascade(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsChildrenCascadeQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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

    @Get('pnsSexualContactsByAgeSex')
    async GetPnsSexualContactsByAgeSex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsSexualContactsByAgeSexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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

    @Get('pnsSexualContactsByCounty')
    async GetPnsSexualContactsByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsSexualContactsByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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

    @Get('pnsSexualContactsByPartner')
    async GetPnsSexualContactsByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsSexualContactsByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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

    @Get('pnsSexualContactsByYear')
    async GetPnsSexualContactsByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsSexualContactsByYearQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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

    @Get('pnsChildrenByYear')
    async GetPnsChildrenByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsChildrenByYearQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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

    @Get('pnsIndex')
    async GetPnsIndex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetPnsIndexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
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
